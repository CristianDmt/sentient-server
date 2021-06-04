import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true, index: true })
  companyId: number;

  @Prop({ required: true, index: true })
  teamId: number;

  @Prop({ required: true, index: true })
  agentId: number;

  @Prop({ required: true })
  agentName: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  teamName: string;

  @Prop({ required: true })
  startTimestamp: number;

  @Prop()
  endTimestamp?: number;

  @Prop()
  analysis?: number;

  @Prop()
  feedback?: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);