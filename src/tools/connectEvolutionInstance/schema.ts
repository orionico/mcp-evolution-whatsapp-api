import { instanceField } from "@/utils/instance";
import * as z from "zod";

export const connectEvolutionInstanceSchema = z.object({
  instanceName: instanceField,
  phoneNumber: z.string().optional().describe("Phone number with country code (e.g., 559999999999)"),
});

export type ConnectEvolutionInstanceSchema = z.infer<typeof connectEvolutionInstanceSchema>; 