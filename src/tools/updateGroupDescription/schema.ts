import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const updateGroupDescriptionSchema = z.object({
  instanceName: instanceField,
  groupJid: z.string().describe("Group JID (e.g. 123456789@g.us)"),
  description: z.string().describe("New group description"),
});

export type UpdateGroupDescriptionSchema = z.infer<typeof updateGroupDescriptionSchema>;
