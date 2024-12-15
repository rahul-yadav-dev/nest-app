import { KafkaMessage } from './kafka-message.interface';

export interface IKafkaService {
  emit(topic: string, data: any): Promise<any>;
  consume(
    topic: string,
    handler: (message: KafkaMessage) => Promise<void>,
  ): Promise<void>;
  disconnect(): Promise<void>;
}
