import { IsArray, ValidateNested, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateEventDto } from './create-event.dto';

export class BatchEventsDto {
  @ApiProperty({ type: [CreateEventDto], description: 'Array of events to ingest (max 100)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  events: CreateEventDto[];
}
