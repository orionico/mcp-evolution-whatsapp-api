import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const getChatMessagesSchema = z.object({
  instanceName: instanceField,
  number: z.string().describe("Phone number with country code (e.g. 5511999999999)"),
  limit: z.number().int().min(1).max(500).default(50).describe("Maximum number of messages to return (default: 50)"),
});

export type GetChatMessagesSchema = z.infer<typeof getChatMessagesSchema>;
