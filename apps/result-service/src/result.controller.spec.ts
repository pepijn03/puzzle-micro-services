import { Test, TestingModule } from '@nestjs/testing';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

describe('ResultServiceController', () => {
  let resultServiceController: ResultController;

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
      controllers: [ResultController],
      providers: [ResultService,
        {
          provide: 'MONGO_CLIENT',
          useFactory: () => {
            return new MongoClient(process.env.MONGODB_URI || '', {
              serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
              }
            });
          }
        },
        {
          provide: 'DATABASE_NAME',
          useValue: process.env.DATABASE || 'defaultDatabase'
        },
        {
          provide: 'COLLECTION_NAME',
          useValue: process.env.RESULT_COLLECTION || 'defaultCollection'
        }
      ]],
    }).compile();

    resultServiceController = app.get<ResultController>(ResultController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(resultServiceController.getHello()).toBe('Hello World!');
    });
  });
});
