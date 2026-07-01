import { instanceField } from "@/utils/instance";
import * as z from "zod";

export const fetchEvolutionInstancesSchema = z.object({
  instanceName: instanceField.optional().describe("Optional. Name of a specific instance to fetch"),
});

export type FetchEvolutionInstancesSchema = z.infer<typeof fetchEvolutionInstancesSchema>; 