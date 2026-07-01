import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const restartEvolutionInstanceSchema = z.object({
  instanceName: instanceField
});

export type RestartEvolutionInstanceSchema = z.infer<typeof restartEvolutionInstanceSchema>; 