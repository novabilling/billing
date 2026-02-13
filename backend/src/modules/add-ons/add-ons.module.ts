import { Module } from '@nestjs/common';
import { AddOnsController } from './add-ons.controller';
import { AddOnsService } from './add-ons.service';

@Module({
  controllers: [AddOnsController],
  providers: [AddOnsService],
  exports: [AddOnsService],
})
export class AddOnsModule {}
