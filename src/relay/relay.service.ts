import { Injectable } from '@nestjs/common';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationMessageDto } from 'src/conversations/dtos/conversation-message.dto';
import { TokenInterface } from 'src/users/interfaces/token.interface';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RelayService {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService
  ) { }

  decodeRelayToken(token: string): TokenInterface {
    return this.usersService.decodeAuthToken(token);
  }

  async getRelayUser(userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  async initConversation(): Promise<void> {
    await this.conversationsService.createConversation();
  }

  async storeMessage(conversation: string, sender: string, message: string): Promise<void> {
    await this.conversationsService.addConversationMessage(new ConversationMessageDto({
      conversation: conversation,
      senderName: sender,
      message: message
    }));
  }

  // async endConversation(): Promise<void> {
  //   await this.conversationsService.updateConversation()
  // }
}
