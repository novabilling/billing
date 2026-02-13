import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum AggregationType {
  COUNT = 'COUNT',
  SUM = 'SUM',
  MAX = 'MAX',
  UNIQUE_COUNT = 'UNIQUE_COUNT',
  LATEST = 'LATEST',
  WEIGHTED_SUM = 'WEIGHTED_SUM',
}

export class CreateBillableMetricFilterDto {
  @ApiProperty({ example: 'region', description: 'Property key to filter on' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: ['us-east', 'eu-west'], description: 'Allowed values' })
  @IsArray()
  @IsString({ each: true })
  values: string[];
}

export class CreateBillableMetricDto {
  @ApiProperty({ example: 'API Calls' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'api_calls', description: 'Unique metric code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+$/, { message: 'Code must contain only lowercase letters, numbers, and underscores' })
  code: string;

  @ApiProperty({ required: false, example: 'Number of API calls made' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: AggregationType, example: 'COUNT' })
  @IsEnum(AggregationType)
  aggregationType: AggregationType;

  @ApiProperty({ required: false, example: 'tokens', description: 'Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)' })
  @IsString()
  @IsOptional()
  fieldName?: string;

  @ApiProperty({ required: false, default: false, description: 'If true, value carries forward across billing periods' })
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
