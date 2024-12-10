import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

describe('AppController', () => {
  let progressController: ProgressController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '../../.env',
        }),
        ClientsModule.register([
          {
            name: 'RABBITMQ_CLIENT',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.MBUS_URI],
              queue: 'main_queue',
              queueOptions: {
                durable: false,
              }
            },
          },
        ]),
      ],
      controllers: [ProgressController],
      providers: [ProgressService],
    }).compile();

    progressController = app.get<ProgressController>(ProgressController);
  });

  describe('root', () => {
    it('should return "Here is the progress!"', () => {
      expect(progressController.getProgress()).toBe('Here is the progress!');
    });
  });
});
