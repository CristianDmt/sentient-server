import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/models/user.model";

@Exclude()
export class CompanyUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  position: string;

  @Expose()
  isSupervisor: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: User) {
    Object.assign(this, {
      ...data.get({ plain: true }),
      position: data['CompanyUser'].position,
      isSupervisor: data['CompanyUser'].isSupervisor,
    });
  }
}