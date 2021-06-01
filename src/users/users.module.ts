import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompaniesModule } from 'src/companies/companies.module';
import { TeamsModule } from 'src/teams/teams.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User])
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes({ path: 'users/*', method: RequestMethod.ALL });
  }
}
