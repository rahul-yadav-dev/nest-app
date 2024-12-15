import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { ConfigService } from '../config/config.service';
import { IMessageHandler } from '../kafka/interfaces/message-handler.interface';
import { KafkaMessage } from '../kafka/interfaces/kafka-message.interface';

@Injectable()
export class ConsumerService implements OnModuleInit, IMessageHandler {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.isConsumerMode) {
      await this.kafkaService.consume(
        this.configService.kafkaConfig.topic,
        this.handle.bind(this),
      );
      this.logger.log('Consumer service initialized');
    }
  }

  async handle(message: KafkaMessage): Promise<void> {
    try {
      this.logger.log(`Processing message: ${JSON.stringify(message.value)}`);
      // Add your message processing logic here
      await this.processMessage(message);
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw error;
    }
  }

  private async processMessage(message: KafkaMessage): Promise<void> {
    // Implement your specific message processing logic here
    this.logger.log(
      `Message processed successfully from topic: ${message.topic}`,
    );
  }
}
