import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ type: 'integer', example: 150 })
  total: number;

  @ApiProperty({ type: 'integer', example: 1 })
  page: number;

  @ApiProperty({ type: 'integer', example: 20 })
  limit: number;

  @ApiProperty({ type: 'integer', example: 8 })
  totalPages: number;
}
