import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateBillableMetricFilterDto } from './create-billable-metric.dto';

export class UpdateBillableMetricDto {
  @ApiProperty({ required: false, example: 'API Requests' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, example: 'Number of API requests' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false, example: 'tokens' })
  @IsString()
  @IsOptional()
  fieldName?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  recurring?: boolean;

  @ApiProperty({ required: false, type: [CreateBillableMetricFilterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillableMetricFilterDto)
  @IsOptional()
  filters?: CreateBillableMetricFilterDto[];
}
