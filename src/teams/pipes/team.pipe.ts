import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from '../models/team.model';

@Injectable()
export class TeamPipe implements PipeTransform<number, Promise<Team>> {
  constructor(@InjectModel(Team) private readonly teamModel: typeof Team) { }

  async transform(value: number, metadata: ArgumentMetadata): Promise<Team> {
    const team = await this.teamModel.findOne({ where: { id: value }});

    if (!team) {
      throw new NotFoundException(`Team '${value}' does not exist.`);
    }

    return team;
  }
}