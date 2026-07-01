import { resolveInstance } from "@/utils/instance";
import type { ToolRegistration } from "@/types";
import { evolutionApi } from "@/utils/evolutionApi";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { getEvolutionSettingsSchema, type GetEvolutionSettingsSchema } from "./schema";

export async function getEvolutionSettings(args: GetEvolutionSettingsSchema) {
  const { instanceName } = args;
  const result = await evolutionApi.getSettings(instanceName);
  return result;
}

export const getEvolutionSettingsTool: ToolRegistration<GetEvolutionSettingsSchema> = {
  name: "get_evolution_settings",
  description: "Retrieve the current behavior settings for a WhatsApp instance including call handling, message receipts, and online status settings",
  inputSchema: makeJsonSchema(getEvolutionSettingsSchema),
  handler: async (args: GetEvolutionSettingsSchema) => {
    try {
      const result = await getEvolutionSettings(args);
      const settings = result.settings.settings;
      
      return {
        content: [
          {
            type: "text",
            text: `📋 Settings for ${args.instanceName}:
            
• ${settings.alwaysOnline ? '✓' : '✗'} Always online
• ${settings.readMessages ? '✓' : '✗'} Read receipts
• ${settings.readStatus ? '✓' : '✗'} Read status
• ${settings.rejectCall ? '✓' : '✗'} Auto-reject calls
• ${settings.groupsIgnore ? '✓' : '✗'} Ignore groups
• ${settings.syncFullHistory ? '✓' : '✗'} Sync full history
${settings.msgCall ? '• Call rejection message: "' + settings.msgCall + '"' : ''}`
          }
        ]
      };
    } catch (error) {
      console.error("Error in getEvolutionSettingsTool handler:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to retrieve settings: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  },
}; 