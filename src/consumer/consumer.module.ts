import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [KafkaModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}
