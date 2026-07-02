import type { ToolRegistration } from "@/types";
import { someFunctionTool } from "./exampleTool";
import { createEvolutionInstanceTool } from "./createEvolutionInstance";
import { getEvolutionInfoTool } from "./getEvolutionInfo";
import { fetchEvolutionInstancesTool } from "./fetchEvolutionInstances";
import { connectEvolutionInstanceTool } from "./connectEvolutionInstance";
import { getConnectionStateTool } from "./getConnectionState";
import { logoutEvolutionInstanceTool } from "./logoutEvolutionInstance";
import { deleteEvolutionInstanceTool } from "./deleteEvolutionInstance";
import { setEvolutionPresenceTool } from "./setEvolutionPresence";
import { setEvolutionWebhookTool } from "./setEvolutionWebhook";
import { setEvolutionSettingsTool } from "./setEvolutionSettings";
import { getEvolutionSettingsTool } from "./getEvolutionSettings";
import { getEvolutionWebhookTool } from "./getEvolutionWebhook";
import { restartEvolutionInstanceTool } from "./restartEvolutionInstance";
import { sendPlainTextTool } from "./sendPlainText";
import { sendStatusTool } from "./sendStatus";
import { sendMediaTool } from "./sendMedia";
import { sendWhatsAppAudioTool } from "./sendWhatsAppAudio";
import { sendStickerTool } from "./sendSticker";
import { sendLocationTool } from "./sendLocation";
import { sendContactTool } from "./sendContact";
import { sendReactionTool } from "./sendReaction";
import { sendPollTool } from "./sendPoll";
import { sendListTool } from "./sendList";
import { sendButtonsTool } from "./sendButtons";
import { fetchAllGroupsTool } from "./fetchAllGroups";
import { findGroupByJidTool } from "./findGroupByJid";
import { findGroupMembersTool } from "./findGroupMembers";
import { findChatsTool } from "./findChats";
import { findContactsTool } from "./findContacts";
import { findMessagesTool } from "./findMessages";
import { getChatMessagesTool } from "./getChatMessages";
import { getContactNameTool } from "./getContactName";
import { createGroupTool } from "./createGroup";
import { updateGroupParticipantsTool } from "./updateGroupParticipants";
import { updateGroupSubjectTool } from "./updateGroupSubject";
import { updateGroupDescriptionTool } from "./updateGroupDescription";
import { updateGroupSettingTool } from "./updateGroupSetting";
import { leaveGroupTool } from "./leaveGroup";
import { getGroupInviteCodeTool } from "./getGroupInviteCode";
import { findLabelsTool } from "./findLabels";
import { handleLabelTool } from "./handleLabel";
import { findChatsByLabelTool } from "./findChatsByLabel";
import { findChatByRemoteJidTool } from "./findChatByRemoteJid";
import { searchMessagesInChatTool } from "./searchMessagesInChat";

// biome-ignore lint/suspicious/noExplicitAny: Any is fine here because all tools validate their input schemas.
export const createTools = (): ToolRegistration<any>[] => {
	return [
		{
			...someFunctionTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => someFunctionTool.handler(args),
		},
		{
			...createEvolutionInstanceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => createEvolutionInstanceTool.handler(args),
		},
		{
			...getEvolutionInfoTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getEvolutionInfoTool.handler(args),
		},
		{
			...fetchEvolutionInstancesTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => fetchEvolutionInstancesTool.handler(args),
		},
		{
			...connectEvolutionInstanceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => connectEvolutionInstanceTool.handler(args),
		},
		{
			...getConnectionStateTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getConnectionStateTool.handler(args),
		},
		{
			...logoutEvolutionInstanceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => logoutEvolutionInstanceTool.handler(args),
		},
		{
			...deleteEvolutionInstanceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => deleteEvolutionInstanceTool.handler(args),
		},
		{
			...restartEvolutionInstanceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => restartEvolutionInstanceTool.handler(args),
		},
		{
			...setEvolutionPresenceTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => setEvolutionPresenceTool.handler(args),
		},
		{
			...setEvolutionWebhookTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => setEvolutionWebhookTool.handler(args),
		},
		{
			...getEvolutionWebhookTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getEvolutionWebhookTool.handler(args),
		},
		{
			...setEvolutionSettingsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => setEvolutionSettingsTool.handler(args),
		},
		{
			...getEvolutionSettingsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getEvolutionSettingsTool.handler(args),
		},
		{
			...sendPlainTextTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendPlainTextTool.handler(args),
		},
		{
			...sendStatusTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendStatusTool.handler(args),
		},
		{
			...sendMediaTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendMediaTool.handler(args),
		},
		{
			...sendWhatsAppAudioTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendWhatsAppAudioTool.handler(args),
		},
		{
			...sendStickerTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendStickerTool.handler(args),
		},
		{
			...sendLocationTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendLocationTool.handler(args),
		},
		{
			...sendContactTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendContactTool.handler(args),
		},
		{
			...sendReactionTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendReactionTool.handler(args),
		},
		{
			...sendPollTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendPollTool.handler(args),
		},
		{
			...sendListTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendListTool.handler(args),
		},
		{
			...sendButtonsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => sendButtonsTool.handler(args),
		},
		{
			...fetchAllGroupsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => fetchAllGroupsTool.handler(args),
		},
		{
			...findGroupByJidTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findGroupByJidTool.handler(args),
		},
		{
			...findGroupMembersTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findGroupMembersTool.handler(args),
		},
		{
			...findChatsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findChatsTool.handler(args),
		},
		{
			...findContactsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findContactsTool.handler(args),
		},
		{
			...findMessagesTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findMessagesTool.handler(args),
		},
		{
			...getChatMessagesTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getChatMessagesTool.handler(args),
		},
		{
			...getContactNameTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getContactNameTool.handler(args),
		},
		{
			...createGroupTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => createGroupTool.handler(args),
		},
		{
			...updateGroupParticipantsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => updateGroupParticipantsTool.handler(args),
		},
		{
			...updateGroupSubjectTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => updateGroupSubjectTool.handler(args),
		},
		{
			...updateGroupDescriptionTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => updateGroupDescriptionTool.handler(args),
		},
		{
			...updateGroupSettingTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => updateGroupSettingTool.handler(args),
		},
		{
			...leaveGroupTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => leaveGroupTool.handler(args),
		},
		{
			...getGroupInviteCodeTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => getGroupInviteCodeTool.handler(args),
		},
		{
			...findLabelsTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findLabelsTool.handler(args),
		},
		{
			...handleLabelTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => handleLabelTool.handler(args),
		},
		{
			...findChatsByLabelTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findChatsByLabelTool.handler(args),
		},
		{
			...findChatByRemoteJidTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => findChatByRemoteJidTool.handler(args),
		},
		{
			...searchMessagesInChatTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => searchMessagesInChatTool.handler(args),
		},
	];
};