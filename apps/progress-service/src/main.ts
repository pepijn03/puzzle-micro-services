import { NestFactory } from '@nestjs/core';
import { ProgressServiceModule } from './progress.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(ProgressServiceModule);
  await app.listen(process.env.PORT ?? 3002);
  logger.log(`Application running on port ` + 3002);
}
bootstrap();
