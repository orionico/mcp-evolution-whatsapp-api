import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { findLabelsSchema, type FindLabelsSchema } from "./schema";

export const findLabelsTool: ToolRegistration<FindLabelsSchema> = {
  name: "find_labels",
  description: "List all WhatsApp labels/tags available on the instance (Baileys integration only).",
  inputSchema: makeJsonSchema(findLabelsSchema),
  handler: async (args: FindLabelsSchema) => {
    try {
      const parsed = findLabelsSchema.parse(args);
      const result = await evolutionApi.findLabels(resolveInstance(parsed.instanceName));
      const count = Array.isArray(result) ? result.length : "unknown";
      return {
        content: [{ type: "text", text: `Found ${count} label(s)\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
