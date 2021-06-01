import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/models/user.model";

@Exclude()
export class TeamUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  isSupervisor: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(data: User) {
    Object.assign(this, {
      ...data.get({ plain: true }),
      isSupervisor: data['TeamUser'].isSupervisor,
    });
  }
}