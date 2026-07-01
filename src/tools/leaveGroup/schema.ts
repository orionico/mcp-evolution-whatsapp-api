import { z } from "zod";

export const leaveGroupSchema = z.object({
  instanceName: z.string().describe("Name of the WhatsApp instance"),
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
});

export type LeaveGroupSchema = z.infer<typeof leaveGroupSchema>;
