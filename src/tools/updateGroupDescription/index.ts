import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { updateGroupDescriptionSchema, type UpdateGroupDescriptionSchema } from "./schema";

export const updateGroupDescriptionTool: ToolRegistration<UpdateGroupDescriptionSchema> = {
  name: "update_group_description",
  description: "Update the description of a WhatsApp group.",
  inputSchema: makeJsonSchema(updateGroupDescriptionSchema),
  handler: async (args: UpdateGroupDescriptionSchema) => {
    try {
      const parsed = updateGroupDescriptionSchema.parse(args);
      const result = await evolutionApi.updateGroupDescription(parsed.instanceName, {
        groupJid: parsed.groupJid,
        description: parsed.description,
      });
      return {
        content: [{ type: "text", text: `Group description updated.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
