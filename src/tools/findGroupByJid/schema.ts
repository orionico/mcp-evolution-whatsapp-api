import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findGroupByJidSchema = z.object({
  instanceName: instanceField,
  groupJid: z.string().describe("Group remote JID (group ID with @g.us suffix)")
});

export type FindGroupByJidSchema = z.infer<typeof findGroupByJidSchema>; 