import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateTenantMoneyDto {
  @IsOptional()
  @IsBoolean()
  payouts?: boolean;

  @IsOptional()
  @IsBoolean()
  collections?: boolean;

  @IsOptional()
  @IsBoolean()
  transfers?: boolean;

  @IsOptional()
  @IsObject()
  payoutApprovalThreshold?: Record<string, string>;

  @IsOptional()
  @IsObject()
  payoutDailyLimit?: Record<string, string>;
}
