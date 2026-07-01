import { z } from "zod";

export const updateGroupParticipantsSchema = z.object({
  instanceName: z.string().describe("Name of the WhatsApp instance"),
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
  action: z.enum(["add", "remove", "promote", "demote"]).describe("Action to perform on participants"),
  participants: z.array(z.string()).min(1).describe("Array of participant phone numbers with country code (e.g. 5511999990000)"),
});

export type UpdateGroupParticipantsSchema = z.infer<typeof updateGroupParticipantsSchema>;
