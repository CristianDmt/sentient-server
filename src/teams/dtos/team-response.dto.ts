import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/models/user.model";
import { Team } from "../models/team.model";
import { TeamUsersResponseDto } from "./team-users-response.dto";

@Exclude()
export class TeamResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  users: TeamUsersResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<Team>) {
    const dataPlain = data.get({ plain: true }) as Team & { users: User[] };

    Object.assign(this, dataPlain, data.users ? { ...new TeamUsersResponseDto(data.users) } : {});
  }
}