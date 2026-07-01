import { z } from "zod";

export const updateGroupSubjectSchema = z.object({
  instanceName: z.string().describe("Name of the WhatsApp instance"),
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
  subject: z.string().min(1).describe("New group name"),
});

export type UpdateGroupSubjectSchema = z.infer<typeof updateGroupSubjectSchema>;
