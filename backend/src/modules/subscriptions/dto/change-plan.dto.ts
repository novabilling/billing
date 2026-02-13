import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePlanDto {
  @ApiProperty({ description: 'New plan ID' })
  @IsString()
  @IsNotEmpty()
  newPlanId: string;

  @ApiProperty({ required: false, default: false, description: 'Whether to prorate charges' })
  @IsBoolean()
  @IsOptional()
  prorate?: boolean = false;
}
