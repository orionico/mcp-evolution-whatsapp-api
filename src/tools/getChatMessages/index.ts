import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { getChatMessagesSchema, type GetChatMessagesSchema } from "./schema";

export const getChatMessagesTool: ToolRegistration<GetChatMessagesSchema> = {
  name: "get_chat_messages",
  description: "Fetch message history for a specific WhatsApp contact by phone number. Returns messages stored in the Evolution API local database.",
  inputSchema: makeJsonSchema(getChatMessagesSchema),
  handler: async (args: GetChatMessagesSchema) => {
    try {
      const parsed = getChatMessagesSchema.parse(args);

      const clean = parsed.number.replace(/\D/g, "");
      if (clean.length < 10 || clean.length > 15) {
        return {
          content: [{ type: "text", text: "Error: 'number' must be a valid phone number with 10–15 digits (e.g. 5511999999999)." }],
          isError: true,
        };
      }

      const chatId = `${clean}@s.whatsapp.net`;
      const result = await evolutionApi.findMessages(parsed.instanceName, {
        chatId,
        limit: parsed.limit,
      });

      const messages = Array.isArray(result) ? result : (result as any)?.messages ?? result;
      const count = Array.isArray(messages) ? messages.length : "unknown";

      return {
        content: [{
          type: "text",
          text: `Found ${count} message(s) for +${clean} in instance ${parsed.instanceName}\n\n${JSON.stringify(result, null, 2)}`,
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
