import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RequirePermission } from '../../common/auth/permissions';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { ChangeRoleDto, InviteMemberDto } from './team.dto';
import { TeamService } from './team.service';

/** Team management happens in the dashboard, as a person: API keys cannot add or remove people. */
@ApiTags('Team')
@ApiBearerAuth('api-key')
@Public()
@UseGuards(TenantGuard)
@RequirePermission('team.manage')
@Controller('team')
export class TeamController {
  constructor(private readonly team: TeamService) {}

  @Get('members')
  @ApiOperation({ summary: 'People in this organisation and their roles' })
  members(@Req() req: RequestWithTenant) {
    return this.team.members(req.tenant.id);
  }

  @Get('invitations')
  @ApiOperation({ summary: 'Invitations not yet accepted' })
  invitations(@Req() req: RequestWithTenant) {
    return this.team.invitations(req.tenant.id);
  }

  @Post('invitations')
  @ApiOperation({ summary: 'Invite someone by email; returns the link too, in case email is not set up' })
  invite(@Req() req: RequestWithTenant, @Body() dto: InviteMemberDto) {
    return this.team.invite(req.tenant, this.actor(req), dto.email, dto.role, process.env.DASHBOARD_URL || 'http://localhost:3000');
  }

  @Delete('invitations/:id')
  @HttpCode(204)
  revoke(@Req() req: RequestWithTenant, @Param('id') id: string) {
    return this.team.revokeInvitation(req.tenant.id, id);
  }

  @Patch('members/:userId')
  @ApiOperation({ summary: "Change a member's role" })
  async changeRole(@Req() req: RequestWithTenant, @Param('userId') userId: string, @Body() dto: ChangeRoleDto) {
    await this.team.changeRole(req.tenant.id, this.actor(req), userId, dto.role);
    return this.team.members(req.tenant.id);
  }

  @Delete('members/:userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a member' })
  remove(@Req() req: RequestWithTenant, @Param('userId') userId: string) {
    return this.team.remove(req.tenant.id, this.actor(req), userId);
  }

  /** Anyone may leave, as long as an owner remains. */
  @Delete('me')
  @RequirePermission('read')
  @HttpCode(204)
  leave(@Req() req: RequestWithTenant) {
    const actor = this.actor(req);
    return this.team.remove(req.tenant.id, actor, actor.userId);
  }

  private actor(req: RequestWithTenant) {
    if (!req.member) throw new ForbiddenException('Team changes are made by a signed-in person, not an API key');
    return req.member;
  }
}
