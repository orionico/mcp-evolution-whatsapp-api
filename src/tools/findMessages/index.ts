import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findMessagesSchema, type FindMessagesSchema } from "./schema";

export const findMessagesTool: ToolRegistration<FindMessagesSchema> = {
  name: "find_messages",
  description: "Search WhatsApp messages by full-text query and/or filter by chat ID. Returns message history from the Evolution API local database.",
  inputSchema: makeJsonSchema(findMessagesSchema),
  handler: async (args: FindMessagesSchema) => {
    try {
      const parsed = findMessagesSchema.parse(args);

      if (!parsed.query && !parsed.chatId) {
        return {
          content: [{ type: "text", text: "Error: provide at least one of 'query' (search term) or 'chatId' (chat JID)." }],
          isError: true,
        };
      }

      const result = await evolutionApi.findMessages(parsed.instanceName, {
        query: parsed.query,
        chatId: parsed.chatId,
        limit: parsed.limit,
      });

      const messages = Array.isArray(result) ? result : (result as any)?.messages ?? result;
      const count = Array.isArray(messages) ? messages.length : "unknown";

      return {
        content: [{
          type: "text",
          text: `Found ${count} message(s) for instance ${parsed.instanceName}\n\n${JSON.stringify(result, null, 2)}`,
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
