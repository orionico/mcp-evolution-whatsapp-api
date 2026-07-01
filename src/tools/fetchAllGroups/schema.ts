import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const fetchAllGroupsSchema = z.object({
  instanceName: instanceField,
  getParticipants: z.boolean().optional().describe("Whether to get the group members or not")
});

export type FetchAllGroupsSchema = z.infer<typeof fetchAllGroupsSchema>; 