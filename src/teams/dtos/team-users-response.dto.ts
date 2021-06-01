import { User } from "src/users/models/user.model";
import { TeamUserResponseDto } from "./team-user-response.dto";

export class TeamUsersResponseDto {
  users: TeamUserResponseDto[];

  constructor(data: User[]) {
    Object.assign(this, {
      users: data.map((user: User) => {
        return new TeamUserResponseDto(user);
      })
    });
  }
}