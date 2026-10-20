import { IsDateString, IsIn, IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export const ACCESS_MODES = ['FULL', 'READ_ONLY', 'SUSPENDED'] as const;
export const BILLING_STATUSES = ['trialing', 'active', 'past_due', 'canceled'] as const;

/** Access and billing state an operator or a control plane sets on an organisation. Null clears a field. */
export class UpdateTenantAccessDto {
  @IsOptional()
  @IsIn(ACCESS_MODES)
  accessMode?: (typeof ACCESS_MODES)[number];

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(500)
  accessReason?: string | null;

  /** Where the organisation resolves it, e.g. a page to pay an overdue invoice. */
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsUrl({ protocols: ['https', 'http'], require_tld: false })
  @MaxLength(2000)
  accessUrl?: string | null;

  @IsOptional()
  @IsIn(BILLING_STATUSES)
  billingStatus?: (typeof BILLING_STATUSES)[number];

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(200)
  billingPlanId?: string | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsDateString()
  trialEndsAt?: string | null;
}
