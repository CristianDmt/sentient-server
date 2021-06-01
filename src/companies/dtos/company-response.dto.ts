import { Exclude, Expose } from "class-transformer";
import { number } from "joi";
import { User } from "src/users/models/user.model";
import { Company } from "../models/company.model";
import { CompanyUsersResponseDto } from "./company-users-response.dto";

@Exclude()
export class CompanyResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  users: CompanyUsersResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<Company>) {
    const dataPlain = data.get({ plain: true }) as Company & { users: User[] };

    Object.assign(this, dataPlain, data.users ? { ...new CompanyUsersResponseDto(data.users) } : {});
  }
}