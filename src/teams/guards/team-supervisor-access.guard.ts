import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { CompanyUser } from 'src/companies/models/company-user.model';
import { Company } from 'src/companies/models/company.model';
import { User, USER_SCOPE_FULL_WITH_PERMISSIONS } from 'src/users/models/user.model';
import { TeamUser } from '../models/team-user.model';
import { Team } from '../models/team.model';

const TEAM_ID_PARAM = 'teamId';

@Injectable()
export class TeamSupervisorAccessGuard implements CanActivate {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAllowed = this.validateRequest(request);

    if (!isAllowed) {
      throw new ForbiddenException(`Missing permissions`);
    }

    return isAllowed;
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const user = await this.userModel.scope(USER_SCOPE_FULL_WITH_PERMISSIONS).findOne({
      include: [
        { model: Company, include: [{ model: CompanyUser, where: { userId: request.jwt.userId } }] },
        { model: Team, include: [{ model: TeamUser, where: { teamId: request.params[TEAM_ID_PARAM], userId: request.jwt.userId } }] }
      ],
      where: { id: request.jwt.userId }
    });

    const isCompanySupervisor = user.company[0]?.companyUsers[0]?.isSupervisor;
    const isTeamSupervisor = user.teams[0]?.teamUsers[0]?.isSupervisor;

    return !!isCompanySupervisor || !!isTeamSupervisor;
  }
}