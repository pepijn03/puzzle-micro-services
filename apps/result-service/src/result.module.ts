import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { MongoClient, ServerApiVersion } from 'mongodb';

@Module({
  imports: [],
  controllers: [ResultController],
  providers: [ResultService, {
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
  }],
})
export class ResultServiceModule {}
