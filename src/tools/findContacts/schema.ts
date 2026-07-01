import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findContactsSchema = z.object({
  instanceName: instanceField,
  where: z
    .object({
      id: z.string().optional().describe("Filter by contact ID/phone number"),
      name: z.string().optional().describe("Filter by contact name")
    })
    .optional()
    .describe("Filter criteria for contacts")
});

export type FindContactsSchema = z.infer<typeof findContactsSchema>; 