import { Logger, Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { UsersModule } from 'src/users/users.module';
import { RelayGateway } from './relay.gateway';
import { RelayService } from './relay.service';

@Module({
  imports: [UsersModule, ConversationsModule],
  providers: [Logger, RelayService, RelayGateway]
})
export class RelayModule { }
