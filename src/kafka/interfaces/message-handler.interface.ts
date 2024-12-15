import { KafkaMessage } from './kafka-message.interface';

export interface IMessageHandler {
  handle(message: KafkaMessage): Promise<void>;
}
