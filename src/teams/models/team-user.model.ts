import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { TeamUserAttributes } from './team-user.attributes';
import { Team } from './team.model';

@Table({
  tableName: 'team_users'
})
export class TeamUser extends Model<TeamUserAttributes> {
  @Column
  @ForeignKey(() => Team)
  teamId: number;

  @Unique
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  isSupervisor: boolean;

  @BelongsTo(() => Team)
  teams: Team[];
}