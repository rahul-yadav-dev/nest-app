import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { EventDataInput } from './common/dto/event.dto';

@Injectable()
export class AppService {
  constructor(private readonly kafkaService: KafkaService) {}

  sendEvent(data: EventDataInput) {
    return this.kafkaService.emit('my-test', data.payload);
  }

  getData(): string {
    return 'Hello from the app mode!';
  }
}
