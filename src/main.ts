import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (configService.isAppMode) {
    app.enableCors();
  }

  const port = configService.port;
  await app.listen(port);

  logger.log(
    `Application is running in ${configService.get('mode')} mode on port ${port}`,
  );
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
