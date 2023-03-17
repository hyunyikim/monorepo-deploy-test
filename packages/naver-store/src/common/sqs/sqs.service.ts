import { Injectable } from "@nestjs/common";
import { SQS } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { Message, SendMessageRequest } from "aws-sdk/clients/sqs";

@Injectable()
export class SqsService {
  private queueUrl: string;
  constructor(private sqs: SQS, private config: ConfigService) {
    this.queueUrl = config.getOrThrow<string>("aws.sqs.url");
  }
  async send(sendParams: Omit<SendMessageRequest, "QueueUrl">) {
    return await this.sqs
      .sendMessage({ ...sendParams, QueueUrl: this.queueUrl })
      .promise();
  }

  async consume() {
    const receive = await this.sqs
      .receiveMessage({
        QueueUrl: this.queueUrl,
        AttributeNames: [
          "ApproximateFirstReceiveTimestamp",
          "ApproximateReceiveCount",
          "SenderId",
          "SentTimestamp",
        ],
        MessageAttributeNames: ["All"],
        WaitTimeSeconds: 0,
      })
      .promise();

    receive.Messages &&
      (await this.sqs
        .deleteMessage({
          QueueUrl: this.queueUrl,
          ReceiptHandle: (receive.Messages as Message[])[0]
            .ReceiptHandle as string,
        })
        .promise());

    return receive.Messages?.[0];
  }
}
