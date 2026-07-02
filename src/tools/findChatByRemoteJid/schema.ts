import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findChatByRemoteJidSchema = z.object({
  instanceName: instanceField,
  remoteJid: z.string().describe("Exact remoteJid to look up (e.g. 5511999999999@s.whatsapp.net or 123456789@lid), as stored in the database"),
});

export type FindChatByRemoteJidSchema = z.infer<typeof findChatByRemoteJidSchema>;
