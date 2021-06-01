import { IsBoolean } from "class-validator";
import { TeamUser } from "../models/team-user.model";

export class AddTeamUserDto {
  @IsBoolean()
  isSupervisor: boolean;

  constructor(data: Partial<TeamUser>) {
    Object.assign(this, data);
  }
}