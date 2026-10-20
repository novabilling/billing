import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';
import { MemberRole } from '../../generated/prisma-central/client';
import { ROLES } from '../../common/auth/permissions';

export class InviteMemberDto {
  @ApiProperty({ example: 'jane@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ROLES, example: 'FINANCE' })
  @IsIn(ROLES)
  role: MemberRole;
}

export class ChangeRoleDto {
  @ApiProperty({ enum: ROLES })
  @IsIn(ROLES)
  role: MemberRole;
}
