import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_OFFSET } from 'src/constants';
import { QueryPaginationDto } from '../dtos/query-pagination.dto';

@Injectable()
export class QueryPaginationPipe implements PipeTransform<{ limit?: string, offset?: string } | null, QueryPaginationDto> {
  transform(value: { limit?: string, offset?: string } | null, metadata: ArgumentMetadata): QueryPaginationDto {
    return new QueryPaginationDto({ 
      limit: value?.limit ? Number.parseInt(value.limit) : DEFAULT_QUERY_LIMIT, 
      offset: value?.offset ? Number.parseInt(value.offset) : DEFAULT_QUERY_OFFSET, 
    });
  }
}