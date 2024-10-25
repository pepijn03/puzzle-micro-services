import { NestFactory } from '@nestjs/core';
import { PuzzleServiceModule } from './puzzle.module';

async function bootstrap() {
  const app = await NestFactory.create(PuzzleServiceModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
