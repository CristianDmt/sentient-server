import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyUser } from 'src/companies/models/company-user.model';
import { AuthenticationMiddleware } from 'src/users/middleware/authentication.middleware';
import { User } from 'src/users/models/user.model';
import { TeamUser } from './models/team-user.model';
import { Team } from './models/team.model';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Team,
      TeamUser,
      CompanyUser,
      User
    ])
  ],
  exports: [SequelizeModule],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(TeamsController);
  }
}
