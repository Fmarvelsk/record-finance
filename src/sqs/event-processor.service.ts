import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { SqsService } from './sqs.service';
// import { UsersService } from './users/users.service';
// import { MatchesService } from './matches/matches.service';
// import { QuestionsService } from './questions/questions.service';
// import {
//   ILMSObject,
//   IMatchObject,
//   IPMPObject,
//   IQuestionObject,
// } from './interfaces/match-events.interface';
// import { PmpsService } from './pmps/pmps.service';
// import { LmssService } from './lmss/lmss.service';

@Injectable()
export class EventsProcessor {
  private logger = new Logger(EventsProcessor.name);
  private queueUrl: string;
  private baseWaitTime = 10_000; // Base wait time in milliseconds
  private maxWaitTime = 60_000 * 5; // Maximum wait time in milliseconds
  private waitTime = this.baseWaitTime; // Current wait time starts at base
  private multiplier = 2; // Multiplier for each step without messages

  constructor(
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
    // private usersService: UsersService,
  ) {
    this.queueUrl = <string>configService.getOrThrow('SQS_QUEUE_URL');
    this.pollSQS();
  }

  /**
   * Polls the SQS queue
   */
  async pollSQS() {
    while (true) {
      try {
        this.logger.log('Polling for messages...');
        const messages = await this.sqsService.receiveMessage(this.queueUrl);

        if (messages.length === 0) {
          this.logger.log(
            `No messages, waiting for ${this.waitTime}ms before next poll.`,
          );
          await new Promise((resolve) => setTimeout(resolve, this.waitTime));
          this.waitTime = Math.min(
            this.maxWaitTime,
            this.waitTime * this.multiplier,
          );
          continue;
        }

        // Process messages in parallel and track results
        const processingResults = await Promise.all(
          messages.map(async (message) => {
            // const messageBody = JSON.parse(message.Body) as IMatchObject<
            //   IQuestionObject | ILMSObject | IPMPObject
            // >;

            let result = false;
            result = await this.processQuestion(message);
            // switch (messageBody.type.toLowerCase()) {
            //   case 'question':
            //     result = await this.processQuestion(message);
            //     break;
            //   case 'pmp':
            //     result = await this.processPMP(message);
            //     break;
            //   case 'lms':
            //     result = await this.processLMS(message);
            //     break;
            //   default:
            //     result = false;
            //     break;
            // }

            return { receiptHandle: message.ReceiptHandle!, success: result };
          }),
        );

        // Filter successful processing results for deletion
        const receiptHandlesToBeDeleted = processingResults
          .filter((result) => result.success)
          .map((result) => result.receiptHandle);

        if (receiptHandlesToBeDeleted.length) {
          await this.sqsService.deleteMessagesBatch(
            this.queueUrl,
            receiptHandlesToBeDeleted,
          );
        }
        this.waitTime = this.baseWaitTime;
        break;
      } catch (error) {
        this.logger.error('Error handling SQS messages: ', error);
      }
    }
  }

  /**
   * Process questions
   */
  private async processQuestion(message: SQS.Message): Promise<boolean> {
    try {
      const messageBody = JSON.parse(
        message.Body!,
      );
      this.logger.log('AssetSeveranceEvents', messageBody);
      //  as IMatchObject<IQuestionObject>;
      // if (!messageBody.matchId) {
      //   this.logger.debug('No match_id in message, skipping message.');
      //   return true;
      // }

      // let match = await this.matchesService.findById(messageBody.matchId);
      // if (!match) {
      //   match = await this.matchesService.createMatch(messageBody);
      //   this.logger.log(`New match with id ${match.id} created.`);
      // }

      // this.logger.log(`Create questions for the match: ${match.id}`);
      return false;
    } catch (err) {
      this.logger.error('Error processing AssetSeveranceEvents: ', err);
      return false;
    }
  }

  private async processAssetSeveranceEvents(message: SQS.Message): Promise<boolean> {
    return false;
  }
}
