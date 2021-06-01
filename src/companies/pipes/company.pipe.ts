import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from '../models/company.model';

@Injectable()
export class CompanyPipe implements PipeTransform<number, Promise<Company>> {
  constructor(@InjectModel(Company) private readonly companyModel: typeof Company) { }

  async transform(value: number, metadata: ArgumentMetadata): Promise<Company> {
    const company = await this.companyModel.findOne({ where: { id: value }});

    if (!company) {
      throw new NotFoundException(`Company '${value}' does not exist.`);
    }

    return company;
  }
}