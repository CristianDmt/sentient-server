import { IsString, IsEmail, Length, IsOptional } from "class-validator";
import { User } from "../models/user.model";

export class PatchUserProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @Length(6, 32)
  @IsOptional()
  linkingCode?: string;

  @Length(8, 32)
  @IsOptional()
  password?: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}