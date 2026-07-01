import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findGroupMembersSchema = z.object({
  instanceName: instanceField,
  groupJid: z.string().describe("Group remote JID (group ID with @g.us suffix)")
});

export type FindGroupMembersSchema = z.infer<typeof findGroupMembersSchema>; 