import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const getContactNameSchema = z.object({
  instanceName: instanceField,
  number: z.string().describe("Phone number with country code (e.g. 5511999999999)"),
});

export type GetContactNameSchema = z.infer<typeof getContactNameSchema>;
