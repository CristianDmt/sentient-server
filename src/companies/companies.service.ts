import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { TeamUser } from 'src/teams/models/team-user.model';
import { User, USER_SCOPE_FULL } from 'src/users/models/user.model';
import { AddCompanyUserDto } from './dtos/add-company-user.dto';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PatchCompanyUserDto } from './dtos/patch-company-user.dto';
import { CompanyUser } from './models/company-user.model';
import { Company, COMPANY_SCOPE_MEMBERS } from './models/company.model';

const DEFAULT_POSITION = 'Owner';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private readonly companyModel: typeof Company,
    @InjectModel(CompanyUser) private readonly companyUserModel: typeof CompanyUser,
    @InjectModel(TeamUser) private readonly teamUserModel: typeof TeamUser,
    @InjectModel(User) private readonly userModel: typeof User
  ) { }

  async createCompany(userId: number, companyData: CreateCompanyDto): Promise<Company> {
    const userCompany = await this.companyUserModel.findOne({ where: { userId: userId } });
    
    if (userCompany) {
      throw new ConflictException(`User '${userId}' is already part of a company.`);
    }

    await this.validateCompanyName(companyData.name);

    const company = await this.companyModel.create(companyData);

    await this.companyUserModel.create({
      companyId: company.id,
      userId: userId,
      position: DEFAULT_POSITION,
      isSupervisor: true
    });

    return await this.companyModel.scope(COMPANY_SCOPE_MEMBERS).findOne({ where: { id: company.id } });
  }

  async getCompanyUsers(company: Company, pagination: QueryPaginationDto): Promise<User[]> {
    return await company.$get('users', pagination.get());
  }

  async getCompanyUser(company: Company, userId: number): Promise<User> {
    const user = await company.$get('users', { where: { id: userId } });

    if (!user[0]) {
      throw new NotFoundException(`User '${userId}' is not a member of company '${company.id}'.`);
    }

    return user[0];
  }

  async addCompanyUser(company: Company, userId: number, addCompanyUser: AddCompanyUserDto): Promise<User> {
    const user = await this.userModel.scope(USER_SCOPE_FULL).findOne({ where: { id: userId } });

    if (user.linkingCode !== addCompanyUser.linkingCode) {
      throw new BadRequestException(`Invalid linking code provided for user '${userId}'.`);
    }

    if (user.company[0]?.id) {
      throw new ConflictException(`User '${userId}' is already part of a company.`);
    }

    await this.companyUserModel.create({
      companyId: company.id,
      userId: userId,
      position: addCompanyUser.position,
      isSupervisor: addCompanyUser.isSupervisor
    });

    return await this.getCompanyUser(company, userId);
  }

  async updateCompanyUser(company: Company, userId: number, updateCompanyUser: PatchCompanyUserDto): Promise<User> {
    const companyUser = await this.getCompanyUserInstance(company.id, userId);

    Object.assign(companyUser, updateCompanyUser);
    await companyUser.save();

    return await this.getCompanyUser(company, userId);
  }

  async deleteCompanyUser(company: Company, userId: number): Promise<void> {
    await this.teamUserModel.destroy({ where: { userId: userId } });

    const companyUser = await this.getCompanyUserInstance(company.id, userId);
    await companyUser.destroy();
  }

  private async getCompanyUserInstance(companyId: number, userId: number): Promise<CompanyUser> {
    const companyUser = await this.companyUserModel.findOne({
      where: {
        companyId: companyId,
        userId: userId
      }
    });

    if (!companyUser) {
      throw new NotFoundException(`User '${userId}' is not a member of company '${companyId}'.`);
    }

    return companyUser;
  }

  private async validateCompanyName(name: string): Promise<void> {
    const companyCount = await this.companyModel.count({ where: { name }});

    if (companyCount > 0) {
      throw new ConflictException(`Company '${name}' already exists.`);
    }
  }
}
