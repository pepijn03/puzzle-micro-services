import { NestFactory } from '@nestjs/core';
import { ProgressServiceModule } from './progress.module';

async function bootstrap() {
  const app = await NestFactory.create(ProgressServiceModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
