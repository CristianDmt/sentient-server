import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthenticationMiddleware } from 'src/users/middleware/authentication.middleware';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      
    ])
  ],
  exports: [SequelizeModule],
  providers: [ConversationsService],
  controllers: [ConversationsController]
})
export class TeamsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(ConversationsController);
  }
}
