import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsObject, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ example: 'flutterwave', description: 'Provider name' })
  @IsString()
  @IsNotEmpty()
  providerName: string;

  @ApiProperty({ description: 'Provider credentials (will be encrypted)' })
  @IsObject()
  credentials: Record<string, unknown>;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ required: false, default: 1, description: 'Priority (lower = higher)' })
  @IsInt()
  @IsOptional()
  @Min(1)
  priority?: number = 1;
}
