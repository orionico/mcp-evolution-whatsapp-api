import { instanceField } from "@/utils/instance";
import { z } from "zod";

export const getEvolutionWebhookSchema = z.object({
  instanceName: instanceField
});

export type GetEvolutionWebhookSchema = z.infer<typeof getEvolutionWebhookSchema>; 