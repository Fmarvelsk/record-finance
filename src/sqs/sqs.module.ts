import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsProcessor } from './event-processor.service';
import { SqsService } from './sqs.service';

@Module({
  controllers: [],
  imports: [],
  providers: [
    ConfigService,
    EventsProcessor,
    SqsService,
  ],
  exports: [SqsService],
})
export class SqsModule {}
