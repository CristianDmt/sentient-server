import { Logger, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RelayGateway } from './relay.gateway';
import { RelayService } from './relay.service';

@Module({
  imports: [UsersModule],
  exports: [],
  providers: [Logger, RelayService, RelayGateway]
})
export class RelayModule { }
