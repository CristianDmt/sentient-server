import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { CompanyUser } from '../models/company-user.model';

const COMPANY_ID_PARAM = 'companyId';

@Injectable()
export class CompanySupervisorAccessGuard implements CanActivate {
  constructor(@InjectModel(CompanyUser) private readonly companyUserModel: typeof CompanyUser) { }

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
    const isSupervisor = await this.companyUserModel.findOne({
      where: {
        userId: request.jwt.userId,
        companyId: request.params[COMPANY_ID_PARAM],
        isSupervisor: true
      }
    });

    return !!isSupervisor;
  }
}