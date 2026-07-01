import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { updateGroupSubjectSchema, type UpdateGroupSubjectSchema } from "./schema";

export const updateGroupSubjectTool: ToolRegistration<UpdateGroupSubjectSchema> = {
  name: "update_group_subject",
  description: "Rename a WhatsApp group (update its subject/name).",
  inputSchema: makeJsonSchema(updateGroupSubjectSchema),
  handler: async (args: UpdateGroupSubjectSchema) => {
    try {
      const parsed = updateGroupSubjectSchema.parse(args);
      const result = await evolutionApi.updateGroupSubject(parsed.instanceName, {
        groupJid: parsed.groupJid,
        subject: parsed.subject,
      });
      return {
        content: [{ type: "text", text: `Group renamed to "${parsed.subject}".\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
