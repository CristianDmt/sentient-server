import { AllowNull, BelongsToMany, Column, Default, DefaultScope, Length, Model, Scopes, Table, Unique } from 'sequelize-typescript';
import { CompanyUser } from 'src/companies/models/company-user.model';
import { Company } from 'src/companies/models/company.model';
import { TeamUser } from 'src/teams/models/team-user.model';
import { Team } from 'src/teams/models/team.model';
import { UserAttributes } from './user.attributes';

export const USER_SCOPE_AUTH = 'auth';
export const USER_SCOPE_FULL = 'full';
export const USER_SCOPE_FULL_WITH_PERMISSIONS = 'full_with_permissions';

@Table
@DefaultScope(() => ({
  attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt']
}))
@Scopes(() => ({
  [USER_SCOPE_AUTH]: {
    attributes: ['id', 'name', 'email', 'phone', 'password', 'linkingCode', 'isActive', 'createdAt', 'updatedAt']
  },
  [USER_SCOPE_FULL]: {
    attributes: ['id', 'name', 'email', 'phone', 'linkingCode', 'isActive', 'createdAt', 'updatedAt'],
    include: [
      { model: Company },
      { model: Team }
    ]
  },
  [USER_SCOPE_FULL_WITH_PERMISSIONS]: {
    attributes: ['id', 'name', 'email', 'phone', 'linkingCode', 'isActive', 'createdAt', 'updatedAt'],
    include: [
      { model: Company, include: [{ model: CompanyUser }] },
      { model: Team, include: [{ model: TeamUser }] }
    ]
  }
}))
export class User extends Model<UserAttributes> {
  @AllowNull(false)
  @Length({ max: 56 })
  @Column
  name: string;

  @Unique
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull
  @Column
  phone?: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Length({ min: 6, max: 18 })
  @Default('link-me')
  @Column
  linkingCode?: string;

  @Default(true)
  @Column
  isActive?: boolean;

  @BelongsToMany(() => Company, () => CompanyUser)
  company: Company;

  @BelongsToMany(() => Team, () => TeamUser)
  teams: Team[];
}