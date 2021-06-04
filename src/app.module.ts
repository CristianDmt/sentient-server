import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configAggregator from './config/config-aggregator';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from './users/models/user.model';
import { TeamsModule } from './teams/teams.module';
import { CompaniesModule } from './companies/companies.module';
import { Team } from './teams/models/team.model';
import { Company } from './companies/models/company.model';
import { CompanyUser } from './companies/models/company-user.model';
import { TeamUser } from './teams/models/team-user.model';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { RelayModule } from './relay/relay.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configAggregator],
      isGlobal: true
    }),

    SequelizeModule.forRoot({
      ...(configAggregator)().db.mysql,
      models: [
        Company,
        CompanyUser,
        Team,
        TeamUser,
        User
      ],
      autoLoadModels: true,
      synchronize: true,
    } as SequelizeModuleOptions),

    MongooseModule.forRoot((configAggregator)().db.mongo.host, {
      dbName: (configAggregator)().db.mongo.dbName,
      user: (configAggregator)().db.mongo.user,
      pass: (configAggregator)().db.mongo.pass,
      autoCreate: true
    } as MongooseModuleOptions),

    UsersModule,
    TeamsModule,
    CompaniesModule,
    RelayModule,
    ConversationsModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
