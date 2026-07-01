import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const sendReactionSchema = z.object({
  instanceName: instanceField,
  reactionMessage: z.object({
    key: z.object({
      remoteJid: z.string().describe("Chat contact or group remote JID"),
      fromMe: z.boolean().describe("If the message was sent by the instance owner or not"),
      id: z.string().describe("Message ID")
    }).describe("Information about the message to react to"),
    reaction: z.string().describe("Reaction emoji (e.g., '🚀', '❤️', '👍')")
  }).describe("Information about the reaction message to send")
});

export type SendReactionSchema = z.infer<typeof sendReactionSchema>; 