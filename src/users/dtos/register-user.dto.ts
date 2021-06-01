import { IsString, IsEmail, Length, IsOptional } from "class-validator";
import { User } from "../models/user.model";

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone?: string;

  @Length(8, 32)
  password: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}