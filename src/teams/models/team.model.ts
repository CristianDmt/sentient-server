import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { Company } from 'src/companies/models/company.model';
import { User } from 'src/users/models/user.model';
import { TeamUser } from './team-user.model';
import { TeamAttributes } from './team.attributes';

export const TEAM_SCOPE_MEMBERS = 'members';

@Table
@Scopes(() => ({
  [TEAM_SCOPE_MEMBERS]: {
    include: [{
      attributes: ['name', 'email'],
      model: User
    }]
  }
}))
export class Team extends Model<TeamAttributes> {
  @Column
  @ForeignKey(() => Company)
  companyId: number;

  @Column
  name: string;

  @BelongsTo(() => Company)
  company: string;

  @BelongsToMany(() => User, () => TeamUser)
  users: User[];

  @HasMany(() => TeamUser)
  teamUsers: TeamUser[];
}