import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';
import { LedgerProjectorService } from './ledger-projector.service';
import { LedgerRunnerService } from './ledger-runner.service';

@Module({
  controllers: [LedgerController],
  providers: [LedgerService, LedgerProjectorService, LedgerRunnerService],
  exports: [LedgerService, LedgerRunnerService],
})
export class LedgerModule {}
