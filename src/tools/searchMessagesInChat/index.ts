import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { searchMessagesInChatSchema, type SearchMessagesInChatSchema } from "./schema";

function extractMessages(result: unknown): any[] {
  if (Array.isArray(result)) return result;
  const messages = (result as any)?.messages;
  if (Array.isArray(messages)) return messages;
  if (Array.isArray(messages?.records)) return messages.records;
  return [];
}

// Evolution API has no server-side full-text search (verified against
// evolution-foundation/evolution-api's chat.schema.ts — where.message only
// does an exact object-shape match, not substring search). This extracts
// the human-readable text from the message types we've seen in practice and
// filters client-side.
function extractText(message: any): string {
  const m = message?.message;
  if (!m) return "";
  return (
    m.conversation ??
    m.extendedTextMessage?.text ??
    m.imageMessage?.caption ??
    m.videoMessage?.caption ??
    m.documentMessage?.caption ??
    ""
  );
}

export const searchMessagesInChatTool: ToolRegistration<SearchMessagesInChatSchema> = {
  name: "search_messages_in_chat",
  description: "Search for a text substring within a chat's messages. Evolution API has no server-side full-text search, so this fetches recent messages for the chat and filters client-side (case-insensitive).",
  inputSchema: makeJsonSchema(searchMessagesInChatSchema),
  handler: async (args: SearchMessagesInChatSchema) => {
    try {
      const parsed = searchMessagesInChatSchema.parse(args);
      const instanceName = resolveInstance(parsed.instanceName);

      const result = await evolutionApi.findMessages(instanceName, {
        remoteJid: parsed.remoteJid,
        limit: parsed.limit,
      });

      const messages = extractMessages(result);
      const needle = parsed.searchText.toLowerCase();

      const matches = messages
        .filter((msg) => extractText(msg).toLowerCase().includes(needle))
        .map((msg) => ({
          id: msg.id,
          fromMe: msg.key?.fromMe,
          pushName: msg.pushName,
          messageType: msg.messageType,
          text: extractText(msg),
          messageTimestamp: msg.messageTimestamp,
        }));

      return {
        content: [{
          type: "text",
          text: `Found ${matches.length} message(s) matching "${parsed.searchText}" out of ${messages.length} checked in chat ${parsed.remoteJid}\n\n${JSON.stringify(matches, null, 2)}`,
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
