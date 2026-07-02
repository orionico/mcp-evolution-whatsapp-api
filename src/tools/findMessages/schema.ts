import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findMessagesSchema = z.object({
  instanceName: instanceField,
  remoteJid: z.string().optional().describe("Exact WhatsApp JID to filter by (e.g. 5511999999999@s.whatsapp.net or 123456789@lid). Omit to fetch the most recent messages instance-wide — Evolution API has no free-text search."),
  limit: z.number().int().min(1).max(500).default(50).describe("Maximum number of messages to return (default: 50)"),
});

export type FindMessagesSchema = z.infer<typeof findMessagesSchema>;
