import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const findLabelsSchema = z.object({
  instanceName: instanceField,
});

export type FindLabelsSchema = z.infer<typeof findLabelsSchema>;
