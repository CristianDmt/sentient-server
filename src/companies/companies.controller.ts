import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { QueryPaginationPipe } from 'src/common/pipes/query-pagination.pipe';
import { CompaniesService } from './companies.service';
import { CompanyUserResponseDto } from './dtos/company-user-response.dto';
import { CompanyUsersResponseDto } from './dtos/company-users-response.dto';
import { CompanyResponseDto } from './dtos/company-response.dto';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { CompanyAccessGuard } from './guards/company-access.guard';
import { Company } from './models/company.model';
import { CompanyPipe } from './pipes/company.pipe';
import { PatchCompanyUserDto } from './dtos/patch-company-user.dto';
import { CompanySupervisorAccessGuard } from './guards/company-supervisor-access.guard';
import { AddCompanyUserDto } from './dtos/add-company-user.dto';

const COMPANY_ID_PARAM = 'companyId';
const USER_ID_PARAM = 'userId';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  async createCompany(
    @RequestUser() userId: number,
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<CompanyResponseDto> {
    return new CompanyResponseDto(await this.companiesService.createCompany(userId, createCompanyDto));
  }

  @Get(':companyId')
  @UseGuards(CompanyAccessGuard)
  async getCompany(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company
  ): Promise<CompanyResponseDto> {
    return new CompanyResponseDto(company);
  }

  @Get(':companyId/users')
  @UseGuards(CompanyAccessGuard)
  async getCompanyUsers(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company,
    @Query(QueryPaginationPipe) pagination: QueryPaginationDto
  ): Promise<CompanyUsersResponseDto> {
    return new CompanyUsersResponseDto(await this.companiesService.getCompanyUsers(company, pagination));
  }

  @Get(':companyId/users/:userId')
  @UseGuards(CompanyAccessGuard)
  async getCompanyUser(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number
  ): Promise<CompanyUserResponseDto> {
    return new CompanyUserResponseDto(await this.companiesService.getCompanyUser(company, userId));
  }

  @Post(':companyId/users/:userId')
  @UseGuards(CompanySupervisorAccessGuard)
  async addCompanyUser(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
    @Body() addCompanyUserDto: AddCompanyUserDto
  ): Promise<CompanyUserResponseDto> {
    return new CompanyUserResponseDto(await this.companiesService.addCompanyUser(company, userId, addCompanyUserDto));
  }

  @Patch(':companyId/users/:userId')
  @UseGuards(CompanySupervisorAccessGuard)
  async patchCompanyUser(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
    @Body() patchCompanyUserDto: PatchCompanyUserDto
  ): Promise<CompanyUserResponseDto> {
    return new CompanyUserResponseDto(await this.companiesService.updateCompanyUser(company, userId, patchCompanyUserDto));
  }

  @Delete(':companyId/users/:userId')
  @UseGuards(CompanySupervisorAccessGuard)
  async deleteCompanyUser(
    @Param(COMPANY_ID_PARAM, ParseIntPipe, CompanyPipe) company: Company,
    @Param(USER_ID_PARAM, ParseIntPipe) userId: number,
  ): Promise<object> {
    await this.companiesService.deleteCompanyUser(company, userId);

    return {};
  }
}
