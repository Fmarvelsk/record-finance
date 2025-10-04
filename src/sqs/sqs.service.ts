import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import configuration from 'src/config/configuration';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: configuration().sqs.accessKeyId,
  secretAccessKey: configuration().sqs.secretAccessKey,
});

/**
 * Provides an interface to interact with AWS SQS
 * Exposes methods to send, receive and delete messages from a SQS queue
 */
@Injectable()
export class SqsService {
  private sqs;
  private logger = new Logger(SqsService.name);

  constructor() {
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
  }

  /**
   *
   * Interface to fetch messages from SQS queue
   *
   * @param queueUrl - URL of the SQS queue
   * @returns AWS.SQS.Message[]
   */
  async receiveMessage(queueUrl: string): Promise<AWS.SQS.MessageList> {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10, // max number of message to pull from queue
      VisibilityTimeout: 60, // max time SQS will make th message invisible to other consumers
      WaitTimeSeconds: 20, // max time SQS will hold the request if no messages are immediately available.
    };

    try {
      const data = await this.sqs.receiveMessage(params).promise();
      if (data.Messages) {
        this.logger.log(`${data.Messages.length} SQS Messages received`);
        // TODO: Delete messages log
        data.Messages.forEach((message) => {
          this.logger.log('Message', { message });
        });
        return data.Messages;
      } else {
        this.logger.log('No messages to process');
        return [];
      }
    } catch (err) {
      this.logger.error('Receive message  error', err);
      throw err;
    }
  }

  /**
   *
   * Interface to delete messages from SQS queue
   *
   * @param queueUrl - URL of the SQS queue
   * @param receiptHandle - Receipt handle of the message
   */
  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    try {
      await this.sqs.deleteMessage(deleteParams).promise();
      this.logger.log('Message Deleted');
    } catch (err) {
      this.logger.error('Delete message error', err);
      console.log('Delete Error', err);
    }
  }

  /**
   * Interface to send message to SQS queue
   *
   * @param queueUrl
   * @param messageBody
   */
  async sendMessage(queueUrl: string, messageBody: string): Promise<boolean> {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    try {
      const data = await this.sqs.sendMessage(params).promise();
      this.logger.log('Message sent', data.MessageId);
      return true;
    } catch (err) {
      this.logger.error('Send message error', err);
      return false;
    }
  }

  async deleteMessagesBatch(
    queueUrl: string,
    receiptHandles: string[],
  ): Promise<void> {
    const entries = receiptHandles.map((handle, index) => ({
      Id: index.toString(),
      ReceiptHandle: handle,
    }));

    const params: AWS.SQS.DeleteMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: entries,
    };

    try {
      const data = await this.sqs.deleteMessageBatch(params).promise();
      this.logger.log('Delete message batch successful');
      if (data.Failed.length > 0) {
        this.logger.error('Failed to delete messages:', data.Failed);
      }
    } catch (err) {
      this.logger.error('Error in deleting messages batch:', err);
      throw err;
    }
  }
}
