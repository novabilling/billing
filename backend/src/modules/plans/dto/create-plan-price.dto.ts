import { IsString, IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanPriceDto {
  @ApiProperty({ example: 'NGN', description: 'ISO currency code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;

  @ApiProperty({ example: 9999.99, description: 'Price amount' })
  @IsNumber()
  @Min(0)
  amount: number;
}

/**
 * Body of POST /plans/{id}/prices. Its own type because CreatePlanPriceDto is
 * also nested in CreatePlanDto, and generated SDKs wrap a shared request body
 * in an extra `body` field.
 */
export class AddPlanPriceDto extends CreatePlanPriceDto {}
