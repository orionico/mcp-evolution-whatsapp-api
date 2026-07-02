import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findChatsByLabelSchema = z.object({
  instanceName: instanceField,
  labelId: z.string().describe("ID of the label to filter by, as returned by find_labels"),
});

export type FindChatsByLabelSchema = z.infer<typeof findChatsByLabelSchema>;
