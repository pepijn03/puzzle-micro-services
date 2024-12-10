import { NestFactory } from '@nestjs/core';
import { ResultServiceModule } from './result.module';

async function bootstrap() {
  const app = await NestFactory.create(ResultServiceModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
