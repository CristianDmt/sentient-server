import { IsInt, IsOptional } from "class-validator";

export class QueryPaginationDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;

  constructor(data: { limit?: number, offset?: number }) {
    Object.assign(this, data);
  }

  get() {
    return { limit:this.limit, offset: this.offset };
  }
}