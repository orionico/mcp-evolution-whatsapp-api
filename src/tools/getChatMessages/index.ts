import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { getChatMessagesSchema, type GetChatMessagesSchema } from "./schema";

function extractMessages(result: unknown): unknown[] {
  if (Array.isArray(result)) return result;
  const messages = (result as any)?.messages;
  if (Array.isArray(messages)) return messages;
  if (Array.isArray(messages?.records)) return messages.records;
  return [];
}

export const getChatMessagesTool: ToolRegistration<GetChatMessagesSchema> = {
  name: "get_chat_messages",
  description: "Fetch message history for a specific WhatsApp contact by phone number. Note: this filters by the traditional {number}@s.whatsapp.net JID — for contacts WhatsApp has migrated to @lid addressing, use find_messages with the exact remoteJid instead (see find_chats output).",
  inputSchema: makeJsonSchema(getChatMessagesSchema),
  handler: async (args: GetChatMessagesSchema) => {
    try {
      const parsed = getChatMessagesSchema.parse(args);
      const instanceName = resolveInstance(parsed.instanceName);

      const clean = parsed.number.replace(/\D/g, "");
      if (clean.length < 10 || clean.length > 15) {
        return {
          content: [{ type: "text", text: "Error: 'number' must be a valid phone number with 10–15 digits (e.g. 5511999999999)." }],
          isError: true,
        };
      }

      const remoteJid = `${clean}@s.whatsapp.net`;
      const result = await evolutionApi.findMessages(instanceName, {
        remoteJid,
        limit: parsed.limit,
      });

      const messages = extractMessages(result);

      return {
        content: [{
          type: "text",
          text: `Found ${messages.length} message(s) for +${clean} in instance ${instanceName}\n\n${JSON.stringify(messages, null, 2)}`,
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
