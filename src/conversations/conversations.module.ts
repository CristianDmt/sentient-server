import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationMiddleware } from 'src/users/middleware/authentication.middleware';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationMessage, ConversationMessageSchema } from './schemas/conversation-message.schema';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: ConversationMessage.schemaName, schema: ConversationMessageSchema }
    ])
  ],
  exports: [ConversationsService],
  providers: [ConversationsService],
  controllers: [ConversationsController]
})
export class ConversationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(ConversationsController);
  }
}
