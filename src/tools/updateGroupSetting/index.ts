import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { updateGroupSettingSchema, type UpdateGroupSettingSchema } from "./schema";

export const updateGroupSettingTool: ToolRegistration<UpdateGroupSettingSchema> = {
  name: "update_group_setting",
  description: "Update WhatsApp group settings: toggle announcement mode (only admins send) or locked mode (only admins edit info).",
  inputSchema: makeJsonSchema(updateGroupSettingSchema),
  handler: async (args: UpdateGroupSettingSchema) => {
    try {
      const parsed = updateGroupSettingSchema.parse(args);
      const result = await evolutionApi.updateGroupSetting(parsed.instanceName, {
        groupJid: parsed.groupJid,
        action: parsed.action,
      });
      return {
        content: [{ type: "text", text: `Group setting "${parsed.action}" applied.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
