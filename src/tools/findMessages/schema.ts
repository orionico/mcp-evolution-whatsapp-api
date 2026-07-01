import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findMessagesSchema = z.object({
  instanceName: instanceField,
  query: z.string().optional().describe("Full-text search query to search across messages"),
  chatId: z.string().optional().describe("Filter messages by chat JID (e.g. 5511999999999@s.whatsapp.net)"),
  limit: z.number().int().min(1).max(500).default(50).describe("Maximum number of messages to return (default: 50)"),
});

export type FindMessagesSchema = z.infer<typeof findMessagesSchema>;
