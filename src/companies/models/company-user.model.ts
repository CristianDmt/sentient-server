import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Company } from './company.model';
import { CompanyUserAttributes } from './company-user.attributes';

@Table({
  tableName: 'company_users'
})
export class CompanyUser extends Model<CompanyUserAttributes> {
  @Column
  @ForeignKey(() => Company)
  companyId: number;

  @Unique
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  position: string;

  @Column
  isSupervisor: boolean;

  @BelongsTo(() => Company)
  companies: Company[];
}