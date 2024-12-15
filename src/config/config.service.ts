import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly config = {
    mode: process.env.APP_MODE || 'app',
    port: parseInt(process.env.PORT, 10) || 4002,
    kafka: {
      brokers: ['localhost:9092'],
      clientId: 'nest-app',
      groupId: 'my-group',
      topic: 'my-test',
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
