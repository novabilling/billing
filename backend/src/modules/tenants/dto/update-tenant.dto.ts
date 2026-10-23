import {
  IsString,
  IsOptional,
  IsUrl,
  IsObject,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantDto {
  @ApiProperty({ required: false, example: 'Updated Company Name' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, example: 'billing@company.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: 'https://example.com/webhooks' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  webhookUrl?: string;

  @ApiProperty({ required: false, description: 'Custom tenant settings (merged with existing)' })
  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;
}

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production API Key' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['read', 'write'], description: 'Permission scopes' })
  scopes: string[];

  @ApiProperty({ required: false, description: 'Expiration date' })
  @IsOptional()
  expiresAt?: string;
}

export class CreateApiKeyBodyDto {
  @ApiProperty({ example: 'Production API Key' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['read'],
    description: '"read" (reads only) or "write" (everything) for the whole API, or per resource: "customers:read", "invoices:write"',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Matches(/^(read|write|[a-z][a-z0-9-]*:(read|write))$/, { each: true })
  scopes: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  expiresAt?: string;
}
