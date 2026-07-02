import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findChatByRemoteJidSchema, type FindChatByRemoteJidSchema } from "./schema";

export const findChatByRemoteJidTool: ToolRegistration<FindChatByRemoteJidSchema> = {
  name: "find_chat_by_remote_jid",
  description: "Fetch a single Chat row directly by its exact remoteJid, including its labels. Unlike find_chats, this works even for chats with no messages and always returns the labels field.",
  inputSchema: makeJsonSchema(findChatByRemoteJidSchema),
  handler: async (args: FindChatByRemoteJidSchema) => {
    try {
      const parsed = findChatByRemoteJidSchema.parse(args);
      const result = await evolutionApi.findChatByRemoteJid(resolveInstance(parsed.instanceName), parsed.remoteJid);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
