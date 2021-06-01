import { User } from "src/users/models/user.model";
import { CompanyUserResponseDto } from "./company-user-response.dto";

export class CompanyUsersResponseDto {
  users: CompanyUserResponseDto[];

  constructor(data: User[]) {
    Object.assign(this, {
      users: data.map((user: User) => {
        return new CompanyUserResponseDto(user);
      })
    });
  }
}