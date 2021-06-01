import { Exclude, Expose } from "class-transformer";
import { User } from "../models/user.model";

@Exclude()
export class AuthenticateUserResponseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  linkingCode: string;

  @Expose()
  token: string;

  @Expose()
  createdAt: Date;

  constructor(data: Partial<User> & { token: string }) {
    Object.assign(this, data);
  }
}