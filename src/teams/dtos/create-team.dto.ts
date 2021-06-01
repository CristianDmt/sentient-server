import { IsString, IsInt, Length } from "class-validator";
import { Team } from "../models/team.model";

export class CreateTeamDto {
  @IsString()
  @Length(4, 32)
  name: string;

  constructor(data: Partial<Team>) {
    Object.assign(this, data);
  }
}