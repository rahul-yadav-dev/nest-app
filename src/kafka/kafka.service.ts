import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, Producer, Partitioners } from 'kafkajs';
import { ConfigService } from '../config/config.service';
import { IKafkaService } from './interfaces/kafka.interface';
import { KafkaMessage } from './interfaces/kafka-message.interface';

@Injectable()
export class KafkaService implements IKafkaService, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private producer?: Producer;
  private consumer?: Consumer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.kafkaConfig.clientId,
      brokers: this.configService.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    if (this.configService.isAppMode) {
      this.initializeProducer();
    } else {
      this.initializeConsumer();
    }
  }

  private initializeProducer(): void {
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  private initializeConsumer(): void {
    this.consumer = this.kafka.consumer({
      groupId: this.configService.kafkaConfig.groupId,
    });
  }

  async emit(topic: string, data: any): Promise<any> {
    if (!this.configService.isAppMode) {
      throw new Error('Emit is only available in app mode');
    }

    try {
      await this.producer.connect();
      const message = {
        value: JSON.stringify({
          data,
          timestamp: Date.now(), // Use numeric timestamp instead of Date object
        }),
      };

      const result = await this.producer.send({
        topic,
        messages: [message],
      });
      this.logger.log(`Message sent successfully to topic ${topic}`);
      return result;
    } catch (error) {
      this.handleError('Error sending message', error, topic);
      throw error;
    }
  }

  async consume(
    topic: string,
    handler: (message: KafkaMessage) => Promise<void>,
  ): Promise<void> {
    if (!this.configService.isConsumerMode) {
      throw new Error('Consume is only available in consumer mode');
    }

    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      await this.runConsumer(handler);
    } catch (error) {
      this.handleError('Error setting up consumer', error, topic);
      throw error;
    }
  }

  private async runConsumer(
    handler: (message: KafkaMessage) => Promise<void>,
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const value = message.value?.toString();
          if (value) {
            const parsedValue = JSON.parse(value);
            const kafkaMessage: KafkaMessage = {
              topic,
              value: parsedValue.data, // Extract the data from the message
              timestamp: new Date(parsedValue.timestamp).toISOString(), // Convert numeric timestamp back to ISO string
            };
            await handler(kafkaMessage);
            this.logger.log(`Processed message from topic ${topic}`);
          }
        } catch (error) {
          this.handleError('Error processing message', error, topic);
        }
      },
    });
  }

  private handleError(message: string, error: any, topic: string): void {
    this.logger.error(`${message} for topic ${topic}:`, error);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      if (this.producer) {
        await this.producer.disconnect();
      }
    } catch (error) {
      this.handleError('Error disconnecting from Kafka', error, '');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }
}
