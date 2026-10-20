import { Module } from '@nestjs/common';
import { ServicesModule } from '../../services/services.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [ServicesModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
