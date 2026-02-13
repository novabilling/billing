import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillingTiming, GraduatedRangeDto, ChargeFilterDto } from './create-charge.dto';

export class UpdateChargeDto {
  @ApiProperty({ required: false, enum: BillingTiming })
  @IsEnum(BillingTiming)
  @IsOptional()
  billingTiming?: BillingTiming;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  invoiceDisplayName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minAmountCents?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  prorated?: boolean;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;

  @ApiProperty({ required: false, type: [GraduatedRangeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GraduatedRangeDto)
  @IsOptional()
  graduatedRanges?: GraduatedRangeDto[];

  @ApiProperty({ required: false, type: [ChargeFilterDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeFilterDto)
  @IsOptional()
  filters?: ChargeFilterDto[];
}
