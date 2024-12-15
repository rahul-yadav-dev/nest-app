import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app/app.resolver';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule,
    KafkaModule,
    ...(configService.isAppMode
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: true,
            driver: ApolloDriver,
          }),
        ]
      : []),
    ...(configService.isConsumerMode ? [ConsumerModule] : []),
  ],
  controllers: configService.isAppMode ? [AppController] : [],
  providers: configService.isAppMode ? [AppService, AppResolver] : [],
})
export class AppModule {}
