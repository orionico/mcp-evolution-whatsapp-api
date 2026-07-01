import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { createGroupSchema, type CreateGroupSchema } from "./schema";

export const createGroupTool: ToolRegistration<CreateGroupSchema> = {
  name: "create_group",
  description: "Create a new WhatsApp group with a name, participants, and optional description.",
  inputSchema: makeJsonSchema(createGroupSchema),
  handler: async (args: CreateGroupSchema) => {
    try {
      const parsed = createGroupSchema.parse(args);
      const result = await evolutionApi.createGroup(parsed.instanceName, {
        subject: parsed.subject,
        participants: parsed.participants,
        description: parsed.description,
        promoteParticipants: parsed.promoteParticipants,
      });
      return {
        content: [{ type: "text", text: `Group "${parsed.subject}" created successfully.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
