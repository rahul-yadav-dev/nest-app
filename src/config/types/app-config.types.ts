export type AppMode = 'app' | 'consumer';

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  topic: string;
  connectionTimeout: number;
  authenticationTimeout: number;
  retries: number;
  initialRetryTime: number;
  maxRetryTime: number;
}

export interface AppConfig {
  mode: AppMode;
  port: number;
  kafka: KafkaConfig;
}
