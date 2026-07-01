import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { getContactNameSchema, type GetContactNameSchema } from "./schema";

// Simple in-process cache: { instanceName_number -> { name, expiresAt } }
const cache = new Map<string, { name: string | null; expiresAt: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export const getContactNameTool: ToolRegistration<GetContactNameSchema> = {
  name: "get_contact_name",
  description: "Look up the display name (pushName) of a WhatsApp contact by phone number. Results are cached for 5 minutes to avoid redundant API calls.",
  inputSchema: makeJsonSchema(getContactNameSchema),
  handler: async (args: GetContactNameSchema) => {
    try {
      const parsed = getContactNameSchema.parse(args);

      const clean = parsed.number.replace(/\D/g, "");
      if (clean.length < 10 || clean.length > 15) {
        return {
          content: [{ type: "text", text: "Error: 'number' must be a valid phone number with 10–15 digits." }],
          isError: true,
        };
      }

      const cacheKey = `${parsed.instanceName}_${clean}`;
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ number: clean, name: cached.name, source: "cache" }, null, 2),
          }],
        };
      }

      const contactId = `${clean}@s.whatsapp.net`;
      const result = await evolutionApi.findContacts(parsed.instanceName, {
        where: { id: contactId },
      });

      const contacts = Array.isArray(result) ? result : (result as any)?.contacts ?? [];
      const name: string | null = contacts[0]?.pushName ?? null;

      cache.set(cacheKey, { name, expiresAt: Date.now() + TTL_MS });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({ number: clean, name, source: "api" }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
