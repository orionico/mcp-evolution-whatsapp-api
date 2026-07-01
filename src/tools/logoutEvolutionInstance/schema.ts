import { instanceField } from "@/utils/instance";
import * as z from "zod";

export const logoutEvolutionInstanceSchema = z.object({
  instanceName: instanceField,
});

export type LogoutEvolutionInstanceSchema = z.infer<typeof logoutEvolutionInstanceSchema>; 