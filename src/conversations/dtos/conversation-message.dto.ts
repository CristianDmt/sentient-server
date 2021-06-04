import { ConversationMessageDocument } from "../schemas/conversation-message.schema";

export class ConversationMessageDto {
  conversation: string;
  senderName: string;
  message: string;

  constructor(data: Partial<ConversationMessageDocument> | { conversation: string }) {
    Object.assign(this, data);
  }
}