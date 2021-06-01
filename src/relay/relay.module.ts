import { Logger, Module } from '@nestjs/common';
import { RelayGateway } from './relay.gateway';
import { RelayService } from './relay.service';

@Module({
  imports: [],
  exports: [],
  providers: [Logger, RelayService, RelayGateway]
})
export class RelayModule { }
