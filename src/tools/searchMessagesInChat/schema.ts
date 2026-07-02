import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const searchMessagesInChatSchema = z.object({
  instanceName: instanceField,
  remoteJid: z.string().describe("Exact WhatsApp JID of the chat to search in (e.g. 5511999999999@s.whatsapp.net or 123456789@lid)"),
  searchText: z.string().min(1).describe("Text to search for within the chat's messages (case-insensitive substring match)"),
  limit: z.number().int().min(1).max(500).default(200).describe("How many recent messages to fetch and search through (default: 200)"),
});

export type SearchMessagesInChatSchema = z.infer<typeof searchMessagesInChatSchema>;
