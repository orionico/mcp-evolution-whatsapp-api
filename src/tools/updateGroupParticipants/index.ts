import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { updateGroupParticipantsSchema, type UpdateGroupParticipantsSchema } from "./schema";

const actionLabels: Record<string, string> = {
  add: "added to",
  remove: "removed from",
  promote: "promoted to admin in",
  demote: "demoted from admin in",
};

export const updateGroupParticipantsTool: ToolRegistration<UpdateGroupParticipantsSchema> = {
  name: "update_group_participants",
  description: "Add, remove, promote, or demote participants in a WhatsApp group.",
  inputSchema: makeJsonSchema(updateGroupParticipantsSchema),
  handler: async (args: UpdateGroupParticipantsSchema) => {
    try {
      const parsed = updateGroupParticipantsSchema.parse(args);
      const result = await evolutionApi.updateGroupParticipants(parsed.instanceName, {
        groupJid: parsed.groupJid,
        action: parsed.action,
        participants: parsed.participants,
      });
      const label = actionLabels[parsed.action] ?? parsed.action;
      return {
        content: [{ type: "text", text: `${parsed.participants.length} participant(s) ${label} group ${parsed.groupJid}.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
