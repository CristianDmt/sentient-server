import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CompanyUser } from "../models/company-user.model";

export class PatchCompanyUserDto {
  @IsBoolean()
  @IsOptional()
  isSupervisor?: boolean;

  @IsString()
  @IsOptional()
  position?: string;

  constructor(data: Partial<CompanyUser>) {
    Object.assign(this, data);
  }
}