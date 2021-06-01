import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CompanyUser } from 'src/companies/models/company-user.model';
import { User } from 'src/users/models/user.model';
import { AddTeamUserDto } from './dtos/add-team-user.dto';
import { CreateTeamDto } from './dtos/create-team.dto';
import { PatchTeamUserDto } from './dtos/patch-team-user.dto';
import { TeamUser } from './models/team-user.model';
import { Team, TEAM_SCOPE_MEMBERS } from './models/Team.model';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team) private readonly teamModel: typeof Team,
    @InjectModel(TeamUser) private readonly teamUserModel: typeof TeamUser,
    @InjectModel(CompanyUser) private readonly companyUserModel: typeof CompanyUser,
  ) { }

  async createTeam(userId: number, teamData: CreateTeamDto): Promise<Team> {
    const userCompany = await this.companyUserModel.findOne({ where: { userId } });

    if (!userCompany) {
      throw new BadRequestException(`No company found to create a team.`);
    }

    if (!userCompany.isSupervisor) {
      throw new ForbiddenException(`Missing permissions`);
    }

    await this.validateTeamName(teamData.name, userCompany.companyId);

    const team = await this.teamModel.create({ ...teamData, companyId: userCompany.companyId });

    await this.teamUserModel.create({
      teamId: team.id,
      userId: userId,
      isSupervisor: true
    });

    return await this.teamModel.scope(TEAM_SCOPE_MEMBERS).findOne({ where: { id: team.id } });
  }

  async getTeamUsers(company: Team, pagination: QueryPaginationDto): Promise<User[]> {
    return await company.$get('users', pagination.get());
  }

  async getTeamUser(team: Team, userId: number): Promise<User> {
    const user = await team.$get('users', { where: { id: userId } });

    if (!user[0]) {
      throw new NotFoundException(`User '${userId}' is not a member of team '${team.id}'.`);
    }

    return user[0];
  }

  async addTeamUser(team: Team, userId: number, addTeamUser: AddTeamUserDto): Promise<User> {
    const userCompany = await this.companyUserModel.findOne({ where: { userId: userId } });

    if (!userCompany || userCompany.companyId !== team.companyId) {
      throw new BadRequestException(`User '${userId}' is not part of company '${team.companyId}'.`);
    }

    const userTeam = await this.teamUserModel.findOne({ where: { userId: userId, teamId: team.id } });

    if (userTeam) {
      throw new ConflictException(`User '${userId}' is already part of team '${team.id}'.`);
    }

    await this.teamUserModel.create({
      teamId: team.id,
      userId: userId,
      isSupervisor: addTeamUser.isSupervisor
    });

    return await this.getTeamUser(team, userId);
  }

  async updateTeamUser(team: Team, userId: number, updateTeamUser: PatchTeamUserDto): Promise<User> {
    const teamUser = await this.getTeamUserInstance(team.id, userId);

    Object.assign(teamUser, updateTeamUser);
    await teamUser.save();

    return await this.getTeamUser(team, userId);
  }

  async deleteTeamUser(team: Team, userId: number): Promise<void> {
    const teamUser = await this.getTeamUserInstance(team.id, userId);

    await teamUser.destroy();
  }

  private async getTeamUserInstance(teamId: number, userId: number): Promise<TeamUser> {
    const teamUser = await this.teamUserModel.findOne({
      where: {
        teamId: teamId,
        userId: userId
      }
    });

    if (!teamUser) {
      throw new NotFoundException(`User '${userId}' is not a member of team '${teamId}'.`);
    }

    return teamUser;
  }

  private async validateTeamName(name: string, companyId: number): Promise<void> {
    const teamCount = await this.teamModel.count({ where: { name, companyId }});

    if (teamCount > 0) {
      throw new ConflictException(`Team '${name}' already exists.`);
    }
  }
}
