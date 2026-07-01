import { z } from "zod";

export const updateGroupSettingSchema = z.object({
  instanceName: z.string().describe("Name of the WhatsApp instance"),
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
  action: z.enum(["announcement", "not_announcement", "locked", "unlocked"]).describe(
    "announcement: only admins can send messages; not_announcement: everyone can send; locked: only admins can edit group info; unlocked: everyone can edit group info"
  ),
});

export type UpdateGroupSettingSchema = z.infer<typeof updateGroupSettingSchema>;
