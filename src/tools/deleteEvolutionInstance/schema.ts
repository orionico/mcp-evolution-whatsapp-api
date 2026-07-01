import { instanceField } from "@/utils/instance";
import * as z from "zod";

export const deleteEvolutionInstanceSchema = z.object({
  instanceName: instanceField,
});

export type DeleteEvolutionInstanceSchema = z.infer<typeof deleteEvolutionInstanceSchema>; 