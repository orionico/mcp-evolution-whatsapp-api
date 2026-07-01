import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { getGroupInviteCodeSchema, type GetGroupInviteCodeSchema } from "./schema";

export const getGroupInviteCodeTool: ToolRegistration<GetGroupInviteCodeSchema> = {
  name: "get_group_invite_code",
  description: "Get the invite link/code for a WhatsApp group.",
  inputSchema: makeJsonSchema(getGroupInviteCodeSchema),
  handler: async (args: GetGroupInviteCodeSchema) => {
    try {
      const parsed = getGroupInviteCodeSchema.parse(args);
      const result = await evolutionApi.getGroupInviteCode(parsed.instanceName, parsed.groupJid);
      return {
        content: [{ type: "text", text: `Invite code for ${parsed.groupJid}:\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
