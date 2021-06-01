import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { QueryPaginationPipe } from 'src/common/pipes/query-pagination.pipe';
import { TeamsService } from './teams.service';
import { TeamUserResponseDto } from './dtos/team-user-response.dto';
import { TeamUsersResponseDto } from './dtos/team-users-response.dto';
import { TeamResponseDto } from './dtos/team-response.dto';
import { CreateTeamDto } from './dtos/create-team.dto';
import { TeamAccessGuard } from './guards/team-access.guard';
import { Team } from './models/team.model';
import { TeamPipe } from './pipes/team.pipe';
import { PatchTeamUserDto } from './dtos/patch-team-user.dto';
import { TeamSupervisorAccessGuard } from './guards/team-supervisor-access.guard';
import { AddTeamUserDto } from './dtos/add-team-user.dto';

const TEAM_ID_PARAM = 'teamId';
const USER_ID_PARAM = 'userId';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) { }

  @Post()
  async createTeam(
    @RequestUser() userId: number,
    @Body() createTeamDto: CreateTeamDto
  ): Promise<TeamResponseDto> {
    return new TeamResponseDto(await this.teamsService.createTeam(userId, createTeamDto));
  }

  @Get(':teamId')
  @UseGuards(TeamAccessGuard)
  async getTeam(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team
  ): Promise<TeamResponseDto> {
    return new TeamResponseDto(team);
  }

  @Get(':teamId/users')
  @UseGuards(TeamAccessGuard)
  async getTeamUsers(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team,
    @Query(QueryPaginationPipe) pagination: QueryPaginationDto
  ): Promise<TeamUsersResponseDto> {
    return new TeamUsersResponseDto(await this.teamsService.getTeamUsers(team, pagination));
  }

  @Get(':teamId/users/:userId')
  @UseGuards(TeamAccessGuard)
  async getTeamUser(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number
  ): Promise<TeamUserResponseDto> {
    return new TeamUserResponseDto(await this.teamsService.getTeamUser(team, userId));
  }

  @Post(':teamId/users/:userId')
  @UseGuards(TeamSupervisorAccessGuard)
  async addTeamUser(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
    @Body() addTeamUserDto: AddTeamUserDto
  ): Promise<TeamUserResponseDto> {
    return new TeamUserResponseDto(await this.teamsService.addTeamUser(team, userId, addTeamUserDto));
  }

  @Patch(':teamId/users/:userId')
  @UseGuards(TeamSupervisorAccessGuard)
  async patchTeamUser(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
    @Body() patchTeamUserDto: PatchTeamUserDto
  ): Promise<TeamUserResponseDto> {
    return new TeamUserResponseDto(await this.teamsService.updateTeamUser(team, userId, patchTeamUserDto));
  }

  @Delete(':teamId/users/:userId')
  @UseGuards(TeamSupervisorAccessGuard)
  async deleteTeamUser(
    @Param(TEAM_ID_PARAM, ParseIntPipe, TeamPipe) team: Team,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
  ): Promise<object> {
    await this.teamsService.deleteTeamUser(team, userId);

    return {};
  }
}
