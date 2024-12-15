import { Injectable } from '@nestjs/common';
import { AppConfig, AppMode, KafkaConfig } from './types/app-config.types';

@Injectable()
export class ConfigService {
  private readonly config: AppConfig;

  constructor() {
    const mode = (process.env.APP_MODE as AppMode) || 'app';
    if (!this.isValidAppMode(mode)) {
      throw new Error(
        `Invalid APP_MODE: ${mode}. Must be either 'app' or 'consumer'`,
      );
    }

    this.config = {
      mode,
      port: parseInt(process.env.PORT, 10) || 4002,
      kafka: this.loadKafkaConfig(),
    };
  }

  private isValidAppMode(mode: string): mode is AppMode {
    return mode === 'app' || mode === 'consumer';
  }

  private loadKafkaConfig(): KafkaConfig {
    return {
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      clientId: process.env.KAFKA_CLIENT_ID || 'nest-app',
      groupId: process.env.KAFKA_GROUP_ID || 'my-group',
      topic: process.env.KAFKA_TOPIC || 'my-test',
      connectionTimeout:
        parseInt(process.env.KAFKA_CONNECTION_TIMEOUT, 10) || 3000,
      authenticationTimeout:
        parseInt(process.env.KAFKA_AUTH_TIMEOUT, 10) || 1000,
      retries: parseInt(process.env.KAFKA_RETRIES, 10) || 8,
      initialRetryTime:
        parseInt(process.env.KAFKA_INITIAL_RETRY_TIME, 10) || 100,
      maxRetryTime: parseInt(process.env.KAFKA_MAX_RETRY_TIME, 10) || 30000,
    };
  }

  get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.config[key];
  }

  get isAppMode(): boolean {
    return this.config.mode === 'app';
  }

  get isConsumerMode(): boolean {
    return this.config.mode === 'consumer';
  }

  get port(): number {
    return this.config.port;
  }

  get kafkaConfig(): KafkaConfig {
    return this.config.kafka;
  }
}
