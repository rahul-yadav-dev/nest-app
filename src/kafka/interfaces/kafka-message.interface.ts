export interface KafkaMessage {
  value: any;
  topic: string;
  timestamp?: string;
}
