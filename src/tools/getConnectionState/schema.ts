import { instanceField } from "@/utils/instance";
import * as z from "zod";

export const getConnectionStateSchema = z.object({
  instanceName: instanceField,
});

export type GetConnectionStateSchema = z.infer<typeof getConnectionStateSchema>; 