import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PuzzleController } from './puzzle.controller';
import { PuzzleService } from './puzzle.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

// Log the Redis URL to verify it's being read correctly
console.log('Connecting to Redis at:', process.env.REDIS_URL);

@Module({
  imports: [HttpModule, 
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL ,
    }),
  ],
  controllers: [PuzzleController],
  providers: [PuzzleService],
})
export class PuzzleServiceModule {}
