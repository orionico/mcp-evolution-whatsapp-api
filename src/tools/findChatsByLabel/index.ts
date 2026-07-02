import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findChatsByLabelSchema, type FindChatsByLabelSchema } from "./schema";

// Evolution API has no server-side filter for chats by label: the `labels`
// field is a JSONB array of labelId strings on the Chat row, with no
// endpoint or `where` clause to query it directly (verified against
// EvolutionAPI/evolution-api source — see chat.service.ts / schema.prisma).
// This tool fetches all chats and filters client-side by labelId.
export const findChatsByLabelTool: ToolRegistration<FindChatsByLabelSchema> = {
  name: "find_chats_by_label",
  description: "Find WhatsApp chats that have a specific label/tag applied. Evolution API has no server-side filter for this, so it fetches all chats and filters by labelId (Baileys instances only).",
  inputSchema: makeJsonSchema(findChatsByLabelSchema),
  handler: async (args: FindChatsByLabelSchema) => {
    try {
      const parsed = findChatsByLabelSchema.parse(args);
      const instanceName = resolveInstance(parsed.instanceName);

      const result = await evolutionApi.findChats(instanceName, {});
      const chats = Array.isArray(result) ? result : (result as any)?.chats ?? [];

      const matching = chats.filter((chat: any) => {
        const labels: unknown = chat?.labels;
        return Array.isArray(labels) && labels.includes(parsed.labelId);
      });

      // Drop the verbose embedded lastMessage payload — callers just need to
      // know which chats matched, not their full last-message metadata.
      const summarized = matching.map(({ lastMessage, ...chat }: any) => chat);

      return {
        content: [{
          type: "text",
          text: `Found ${summarized.length} chat(s) with label "${parsed.labelId}" out of ${chats.length} total chats\n\n${JSON.stringify(summarized, null, 2)}`,
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
