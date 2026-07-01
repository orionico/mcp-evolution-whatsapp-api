import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { leaveGroupSchema, type LeaveGroupSchema } from "./schema";

export const leaveGroupTool: ToolRegistration<LeaveGroupSchema> = {
  name: "leave_group",
  description: "Make the WhatsApp instance leave a group.",
  inputSchema: makeJsonSchema(leaveGroupSchema),
  handler: async (args: LeaveGroupSchema) => {
    try {
      const parsed = leaveGroupSchema.parse(args);
      const result = await evolutionApi.leaveGroup(parsed.instanceName, parsed.groupJid);
      return {
        content: [{ type: "text", text: `Left group ${parsed.groupJid}.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
