import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { evolutionApi } from "@/utils/evolutionApi";
import { handleLabelSchema, type HandleLabelSchema } from "./schema";

export const handleLabelTool: ToolRegistration<HandleLabelSchema> = {
  name: "handle_label",
  description: "Add or remove a WhatsApp label/tag from a chat (Baileys integration only).",
  inputSchema: makeJsonSchema(handleLabelSchema),
  handler: async (args: HandleLabelSchema) => {
    try {
      const parsed = handleLabelSchema.parse(args);
      const result = await evolutionApi.handleLabel(resolveInstance(parsed.instanceName), {
        number: parsed.number,
        labelId: parsed.labelId,
        action: parsed.action,
      });
      const verb = parsed.action === "add" ? "added to" : "removed from";
      return {
        content: [{ type: "text", text: `Label ${parsed.labelId} ${verb} chat +${parsed.number}.\n\n${JSON.stringify(result, null, 2)}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  },
};
