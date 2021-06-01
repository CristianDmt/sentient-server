import { IsString, Length } from "class-validator";
import { Company } from "../models/company.model";
import { CompanyUsersResponseDto } from "./company-users-response.dto";

export class CreateCompanyDto {
  @IsString()
  @Length(4, 32)
  name: string;

  constructor(data: Partial<Company>) {
    Object.assign(this, data);
  }
}