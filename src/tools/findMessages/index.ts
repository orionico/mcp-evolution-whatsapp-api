import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findMessagesSchema, type FindMessagesSchema } from "./schema";

function extractMessages(result: unknown): unknown[] {
  if (Array.isArray(result)) return result;
  const messages = (result as any)?.messages;
  if (Array.isArray(messages)) return messages;
  if (Array.isArray(messages?.records)) return messages.records;
  return [];
}

export const findMessagesTool: ToolRegistration<FindMessagesSchema> = {
  name: "find_messages",
  description: "Fetch messages for a specific chat by exact JID, or the most recent messages instance-wide if no JID is given. Evolution API has no free-text search — for that, fetch messages and search client-side.",
  inputSchema: makeJsonSchema(findMessagesSchema),
  handler: async (args: FindMessagesSchema) => {
    try {
      const parsed = findMessagesSchema.parse(args);
      const instanceName = resolveInstance(parsed.instanceName);

      const result = await evolutionApi.findMessages(instanceName, {
        remoteJid: parsed.remoteJid,
        limit: parsed.limit,
      });

      const messages = extractMessages(result);
      const scope = parsed.remoteJid ? `for chat ${parsed.remoteJid}` : "instance-wide (no chat filter)";

      return {
        content: [{
          type: "text",
          text: `Found ${messages.length} message(s) ${scope} on instance ${instanceName}\n\n${JSON.stringify(messages, null, 2)}`,
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
