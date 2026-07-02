import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const handleLabelSchema = z.object({
  instanceName: instanceField,
  number: z.string().describe("Phone number with country code (e.g. 5511999999999)"),
  labelId: z.string().describe("ID of the label to add or remove, as returned by find_labels"),
  action: z.enum(["add", "remove"]).describe("Whether to add or remove the label from the chat"),
});

export type HandleLabelSchema = z.infer<typeof handleLabelSchema>;
