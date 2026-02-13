import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateTaxDto {
  @ApiProperty({ example: 'VAT', description: 'Tax name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'vat_18', description: 'Unique tax code (lowercase, underscores)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+$/, { message: 'code must be lowercase alphanumeric with underscores' })
  code: string;

  @ApiProperty({ example: 18, description: 'Tax rate as a percentage (e.g., 18 for 18%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @ApiPropertyOptional({ example: 'Value Added Tax', description: 'Tax description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this tax is applied by default to all invoices' })
  @IsBoolean()
  @IsOptional()
  appliedByDefault?: boolean;
}

export class UpdateTaxDto {
  @ApiPropertyOptional({ example: 'VAT' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  rate?: number;

  @ApiPropertyOptional({ example: 'Value Added Tax' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  appliedByDefault?: boolean;
}

export class AssignTaxDto {
  @ApiProperty({ example: 'clx1234567890', description: 'Tax ID to assign' })
  @IsString()
  @IsNotEmpty()
  taxId: string;
}
