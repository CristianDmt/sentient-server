import { BelongsToMany, Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { Team } from 'src/teams/models/team.model';
import { User } from 'src/users/models/user.model';
import { CompanyAttributes } from './company.attributes';
import { CompanyUser } from './company-user.model';

export const COMPANY_SCOPE_MEMBERS = 'members';

@Table
@Scopes(() => ({
  [COMPANY_SCOPE_MEMBERS]: {
    include: [{
      attributes: ['name', 'email'],
      model: User
    }]
  }
}))
export class Company extends Model<CompanyAttributes> {
  @Column
  name: string;

  @HasMany(() => Team)
  teams: Team[];

  @BelongsToMany(() => User, () => CompanyUser)
  users: User[];

  @HasMany(() => CompanyUser)
  companyUsers: CompanyUser[]; 
}