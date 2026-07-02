import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findChatsByLabelSchema, type FindChatsByLabelSchema } from "./schema";

// Evolution API has no server-side filter for chats by label. Two upstream
// issues make this non-trivial (verified against evolution-foundation/
// evolution-api source):
//
// 1. POST /chat/findChats is driven by a raw SQL query rooted on the Message
//    table (LEFT JOINing Chat/Contact onto it), so it never returns the
//    `labels` column and silently ignores any `where.id` filter.
// 2. Known bug (evolution-foundation/evolution-api#2524, still open):
//    POST /label/handleLabel always resolves the target to the traditional
//    {number}@s.whatsapp.net JID and persists the label there, but for
//    contacts WhatsApp has migrated to LID addressing, findChats surfaces a
//    *different* Chat row — keyed by @lid — as "the" chat. The label ends up
//    on a sibling row findChats never shows, so it looks like handleLabel
//    silently did nothing even though it reports success.
//
// Workaround: use GET /chat/findChatByRemoteJid, which does a direct
// Chat.findFirst by remoteJid (no Message join, so it works even for chats
// with zero messages, and it does return `labels`) — for both the chat's own
// remoteJid and, for @lid chats, its remoteJidAlt sibling.
//
// Residual limitation: this can only find labels on chats that findChats
// already surfaces (i.e. that have at least one message). A labeled sibling
// row with no message-having counterpart in the current chat list is
// invisible to this tool too — there is no way to enumerate "all Chat rows
// with label X" without a direct DB query, since findChats never lists
// chats without messages and there is no bulk "chats by label" endpoint.
export const findChatsByLabelTool: ToolRegistration<FindChatsByLabelSchema> = {
  name: "find_chats_by_label",
  description: "Find WhatsApp chats that have a specific label/tag applied. Evolution API has no server-side filter for this, so it fetches all chats and checks each one's labels directly (also checking the @lid/JID sibling row due to a known upstream bug where handleLabel persists to a different Chat row than the one find_chats/find_chat_by_remote_jid normally surface). Baileys instances only.",
  inputSchema: makeJsonSchema(findChatsByLabelSchema),
  handler: async (args: FindChatsByLabelSchema) => {
    try {
      const parsed = findChatsByLabelSchema.parse(args);
      const instanceName = resolveInstance(parsed.instanceName);

      const result = await evolutionApi.findChats(instanceName, {});
      const chats = Array.isArray(result) ? result : (result as any)?.chats ?? [];

      const hasLabel = (labels: unknown) => Array.isArray(labels) && labels.includes(parsed.labelId);

      const checked = await Promise.all(
        chats.map(async (chat: any) => {
          try {
            const own = await evolutionApi.findChatByRemoteJid(instanceName, chat.remoteJid);
            if (hasLabel((own as any)?.labels)) {
              return { chat, matchedVia: "direct" as const };
            }
          } catch {
            // Fall through to sibling check.
          }

          const remoteJidAlt: string | undefined = chat?.lastMessage?.key?.remoteJidAlt;
          if (!chat?.remoteJid?.endsWith("@lid") || !remoteJidAlt) {
            return null;
          }

          try {
            const sibling = await evolutionApi.findChatByRemoteJid(instanceName, remoteJidAlt);
            if (hasLabel((sibling as any)?.labels)) {
              return { chat, matchedVia: "sibling-jid" as const, siblingRemoteJid: remoteJidAlt };
            }
          } catch {
            // Best-effort: a failed sibling lookup shouldn't fail the whole search.
          }
          return null;
        })
      );

      const matches = checked.filter((entry): entry is NonNullable<typeof entry> => entry !== null);

      // Drop the verbose embedded lastMessage payload — callers just need to
      // know which chats matched, not their full last-message metadata.
      const summarized = matches.map(({ chat, ...meta }) => {
        const { lastMessage, ...rest } = chat;
        return { ...rest, ...meta };
      });

      return {
        content: [{
          type: "text",
          text: `Found ${summarized.length} chat(s) with label "${parsed.labelId}" out of ${chats.length} total chats (checked both direct and @lid/JID sibling rows due to a known Evolution API bug)\n\n${JSON.stringify(summarized, null, 2)}`,
        }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
