import { Test, TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { Result } from '../objects/result.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

// Mock MongoDB Classes
class MockMongoClient {
  private readonly mockDb: MockDb;

  constructor() {
    this.mockDb = new MockDb();
  }

  db(): MockDb {
    return this.mockDb;
  }

  connect = jest.fn().mockResolvedValue(this);
  close = jest.fn().mockResolvedValue(null);
}

class MockDb {
  collection = jest.fn().mockImplementation((name: string) => {
    return new MockCollection();
  });
}

class MockCollection {
  find = jest.fn().mockReturnThis();
  findOne = jest.fn().mockResolvedValue(null);
  insertOne = jest.fn().mockResolvedValue({ insertedId: 'mock-id' });
  toArray = jest.fn().mockResolvedValue([]);
}

describe('ResultController', () => {
  let resultController: ResultController;
  let resultService: ResultService;
  let mockMongoClient: MockMongoClient;
  let mockCollection: MockCollection;

  const mockResult: Result = {
    userName: 'testuser',
    puzzleId: '65f8a1b3e4b0f7e3c8d0e1f2',
    timespan: 120
  };

  beforeEach(async () => {
    // Create mock MongoDB client
    mockMongoClient = new MockMongoClient();
    mockCollection = mockMongoClient.db().collection('results');

    const module: TestingModule = await Test.createTestingModule({
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
      providers: [
        {
          provide: MongoClient,
          useValue: mockMongoClient
        },
        {
          provide: ResultService,
          useFactory: (mongoClient: MongoClient) => {
            return {
              getAllResults: jest.fn(),
              getResultsByPuzzle: jest.fn(),
              getResultByUser: jest.fn(),
              addResult: jest.fn()
            };
          },
          inject: [MongoClient]
        }
      ]
    }).compile();

    resultController = module.get<ResultController>(ResultController);
    resultService = module.get<ResultService>(ResultService);
  });

  describe('getAllResults', () => {
    it('should return an array of results', async () => {
      const results: Result[] = [mockResult];
      
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue(results);
      jest.spyOn(resultService, 'getAllResults').mockResolvedValue(results);

      const result = await resultController.getAllResults();
      expect(result).toBe(results);
      expect(resultService.getAllResults).toHaveBeenCalled();
    });

    it('should return an empty array when no results exist', async () => {
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue([]);
      jest.spyOn(resultService, 'getAllResults').mockResolvedValue([]);

      const result = await resultController.getAllResults();
      expect(result).toEqual([]);
    });
  });

  describe('getResultsByPuzzle', () => {
    it('should return results for a specific puzzle', async () => {
      const puzzleResults: Result[] = [mockResult];
      
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue(puzzleResults);
      jest.spyOn(resultService, 'getResultsByPuzzle').mockResolvedValue(puzzleResults);

      const result = await resultController.getResultsByPuzzle('65f8a1b3e4b0f7e3c8d0e1f2');
      expect(result).toBe(puzzleResults);
      expect(resultService.getResultsByPuzzle).toHaveBeenCalledWith('65f8a1b3e4b0f7e3c8d0e1f2');
    });

    it('should return an empty array when no results exist for a puzzle', async () => {
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue([]);
      jest.spyOn(resultService, 'getResultsByPuzzle').mockResolvedValue([]);

      const result = await resultController.getResultsByPuzzle('nonexistent-puzzle-id');
      expect(result).toEqual([]);
    });
  });

  describe('getResultsByUser', () => {
    it('should return results for a specific user', async () => {
      const userResults: Result[] = [mockResult];
      
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue(userResults);
      jest.spyOn(resultService, 'getResultByUser').mockResolvedValue(userResults);

      const result = await resultController.getResultsByUser('testuser');
      expect(result).toBe(userResults);
      expect(resultService.getResultByUser).toHaveBeenCalledWith('testuser');
    });

    it('should return an empty array when no results exist for a user', async () => {
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue([]);
      jest.spyOn(resultService, 'getResultByUser').mockResolvedValue([]);

      const result = await resultController.getResultsByUser('nonexistent-user');
      expect(result).toEqual([]);
    });
  });

  describe('addResult', () => {
    it('should successfully add a result', async () => {
      jest.spyOn(resultService, 'addResult').mockResolvedValue(undefined);

      await resultController.addResult(mockResult);
      expect(resultService.addResult).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(resultController.getHello()).toBe('Hello World!');
    });
  });
});