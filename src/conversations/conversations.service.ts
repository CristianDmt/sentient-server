import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { ConversationMessageDto } from './dtos/conversation-message.dto';
import { ConversationMessage, ConversationMessageDocument } from './schemas/conversation-message.schema';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(ConversationMessage.schemaName) private conversationMessageModel: Model<ConversationMessageDocument>,
  ) { }

  async createConversation(): Promise<ConversationDocument> {
    const conversation = new this.conversationModel({
      companyId: 1,
      teamId: 1,
      agentId: 1,
      agentName: 'Cristian Dumitrov',
      customerName: 'Callum Tuna',
      teamName: 'Payment Issues',
      startTimestamp: Date.now()
    });

    return await conversation.save();
  }

  async addConversationMessage(data: ConversationMessageDto): Promise<ConversationMessageDocument> {
    const conversationMessage = new this.conversationMessageModel({ 
      ...data,
      conversation: new mongoose.Types.ObjectId(data.conversation),
      timestamp: Date.now()
    });

    return await conversationMessage.save();
  }
}
