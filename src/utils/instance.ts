import { z } from "zod";

export const DEFAULT_INSTANCE = process.env.EVOLUTION_DEFAULT_INSTANCE;

export const instanceField = DEFAULT_INSTANCE
  ? z.string().optional().describe(`WhatsApp instance name (defaults to "${DEFAULT_INSTANCE}" from EVOLUTION_DEFAULT_INSTANCE env var)`)
  : z.string().describe("WhatsApp instance name");

export function resolveInstance(instanceName: string | undefined): string {
  const resolved = instanceName ?? DEFAULT_INSTANCE;
  if (!resolved) {
    throw new Error(
      "No instance specified. Pass instanceName or set the EVOLUTION_DEFAULT_INSTANCE environment variable."
    );
  }
  return resolved;
}
