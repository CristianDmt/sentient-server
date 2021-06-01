import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamUser } from 'src/teams/models/team-user.model';
import { User } from 'src/users/models/user.model';
import { AuthenticationMiddleware } from '../users/middleware/authentication.middleware';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanySupervisorAccessGuard } from './guards/company-supervisor-access.guard';
import { CompanyUser } from './models/company-user.model';
import { Company } from './models/company.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Company,
      CompanyUser,
      TeamUser,
      User
    ]),
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController]
})
export class CompaniesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(CompaniesController);
  }
}
