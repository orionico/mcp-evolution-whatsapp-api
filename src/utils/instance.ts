import { z } from "zod";

export const DEFAULT_INSTANCE = process.env.EVOLUTION_DEFAULT_INSTANCE;

export const instanceField = DEFAULT_INSTANCE
	? z.string().optional().describe(`WhatsApp instance name (defaults to "${DEFAULT_INSTANCE}" from EVOLUTION_DEFAULT_INSTANCE env var, or per-client via the X-Evolution-Instance header)`)
	: z.string().optional().describe("WhatsApp instance name (or set it once via the X-Evolution-Instance header)");

export function resolveInstance(instanceName: string | undefined): string {
	const resolved = instanceName ?? DEFAULT_INSTANCE;
	if (!resolved) {
		throw new Error(
			"No instance specified. Pass instanceName, set the X-Evolution-Instance HTTP header, or set the EVOLUTION_DEFAULT_INSTANCE environment variable."
		);
	}
	return resolved;
}
