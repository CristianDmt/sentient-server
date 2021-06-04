import { Controller } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CustomerTokenInterface } from './interfaces/customer-token.interface';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  @Post('tokens')
  async getConversationToken(): Promise<CustomerTokenInterface> {
    this.conversationsService.getConversationToken()
  }
}
