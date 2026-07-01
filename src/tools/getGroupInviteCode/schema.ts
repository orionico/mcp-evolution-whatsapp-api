import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const getGroupInviteCodeSchema = z.object({
  instanceName: instanceField,
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
});

export type GetGroupInviteCodeSchema = z.infer<typeof getGroupInviteCodeSchema>;
