import { z } from "zod";

export const createGroupSchema = z.object({
  instanceName: z.string().describe("Name of the WhatsApp instance"),
  subject: z.string().min(1).describe("Group name"),
  participants: z.array(z.string()).min(1).describe("Array of participant phone numbers with country code (e.g. 5511999990000)"),
  description: z.string().optional().describe("Optional group description"),
  promoteParticipants: z.boolean().optional().describe("Promote participants to admin on creation"),
});

export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
