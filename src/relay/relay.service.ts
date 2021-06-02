import { Injectable } from '@nestjs/common';
import { TokenInterface } from 'src/users/interfaces/token.interface';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RelayService {
  constructor(
    private readonly usersService: UsersService
  ) { }

  decodeRelayToken(token: string): TokenInterface {
    return this.usersService.decodeAuthToken(token);
  }

  async getRelayUser(userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }
}
