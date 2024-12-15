import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly config = {
    mode: process.env.APP_MODE || 'app',
    port: parseInt(process.env.PORT, 10) || 4002,
    kafka: {
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      clientId: process.env.KAFKA_CLIENT_ID || 'nest-app',
      groupId: process.env.KAFKA_GROUP_ID || 'my-group',
      topic: process.env.KAFKA_TOPIC || 'my-test',
      connectionTimeout: parseInt(process.env.KAFKA_CONNECTION_TIMEOUT, 10) || 3000,
      authenticationTimeout: parseInt(process.env.KAFKA_AUTH_TIMEOUT, 10) || 1000,
      retries: parseInt(process.env.KAFKA_RETRIES, 10) || 8,
      initialRetryTime: parseInt(process.env.KAFKA_INITIAL_RETRY_TIME, 10) || 100,
      maxRetryTime: parseInt(process.env.KAFKA_MAX_RETRY_TIME, 10) || 30000,
    },
  };

  get<T>(key: string): T {
    return this.config[key] as T;
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

  get kafkaConfig() {
    return this.config.kafka;
  }
}
