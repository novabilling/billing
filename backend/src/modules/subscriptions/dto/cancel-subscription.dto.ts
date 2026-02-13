import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelSubscriptionDto {
  @ApiProperty({
    enum: ['now', 'period_end'],
    description: 'When to cancel: immediately or at end of current period',
  })
  @IsNotEmpty()
  @IsIn(['now', 'period_end'])
  cancelAt: 'now' | 'period_end';
}
