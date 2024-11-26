import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(process.env.port ?? 3001);
  logger.log(`Application running on port ` + 3001);
}
bootstrap();
