import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { User } from "../models/user.model";

export class AuthenticateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 32)
  @IsNotEmpty()
  password: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}