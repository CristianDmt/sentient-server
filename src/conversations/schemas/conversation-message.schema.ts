import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Conversation } from './conversation.schema';

export type ConversationMessageDocument = ConversationMessage & Document;

@Schema()
export class ConversationMessage {
  static schemaName: string = 'conversation_messages';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversation: Conversation;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop()
  analysis?: number;
}

export const ConversationMessageSchema = SchemaFactory.createForClass(ConversationMessage);