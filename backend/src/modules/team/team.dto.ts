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

export class TeamMemberResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@company.com' })
  email: string;

  @ApiProperty({ enum: ROLES })
  role: MemberRole;

  @ApiProperty({ description: 'False once the person is deactivated' })
  active: boolean;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastLoginAt: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  joinedAt: string;
}

export class InvitationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'jane@company.com' })
  email: string;

  @ApiProperty({ enum: ROLES })
  role: MemberRole;

  @ApiProperty({ description: 'Email of the person who sent it' })
  invitedBy: string;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;
}

export class SentInvitationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'jane@company.com' })
  email: string;

  @ApiProperty({ enum: ROLES })
  role: MemberRole;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt: string;

  @ApiProperty({ description: 'The link to accept; share it yourself when email is not set up' })
  acceptUrl: string;

  @ApiProperty({ description: 'Whether the invitation email went out' })
  emailed: boolean;
}
