import { Exclude, Expose } from "class-transformer";
import { User } from "../models/user.model";

@Exclude()
export class UserProfileResponseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;
  
  @Expose()
  linkingCode: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data.get({ plain: true }));
  }
}