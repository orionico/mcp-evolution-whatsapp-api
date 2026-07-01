import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const getEvolutionSettingsSchema = z.object({
  instanceName: instanceField
});

export type GetEvolutionSettingsSchema = z.infer<typeof getEvolutionSettingsSchema>; 