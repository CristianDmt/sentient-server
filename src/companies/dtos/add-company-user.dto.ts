import { IsBoolean, IsString } from "class-validator";
import { CompanyUser } from "../models/company-user.model";

export class AddCompanyUserDto {
  @IsString()
  linkingCode: string;

  @IsBoolean()
  isSupervisor: boolean;

  @IsString()
  position: string;

  constructor(data: Partial<CompanyUser> & { linkingCode: string }) {
    Object.assign(this, data);
  }
}