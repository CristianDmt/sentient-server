import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { TeamUser } from "../models/team-user.model";

export class PatchTeamUserDto {
  @IsBoolean()
  @IsOptional()
  isSupervisor?: boolean;

  constructor(data: Partial<TeamUser>) {
    Object.assign(this, data);
  }
}