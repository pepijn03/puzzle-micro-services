import { Test, TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { PuzzleController } from './puzzle.controller';
import { PuzzleService } from './puzzle.service';
import { Puzzle } from '../objects/puzzle.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
  updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
  aggregate = jest.fn().mockReturnThis();
  toArray = jest.fn().mockResolvedValue([]);
}

describe('PuzzleController', () => {
  let puzzleController: PuzzleController;
  let puzzleService: PuzzleService;
  let mockMongoClient: MockMongoClient;
  let mockCollection: MockCollection;

  const mockPuzzle: Puzzle = {
    id: '65f8a1b3e4b0f7e3c8d0e1f2',
    date: '2024-10-07',
    verticalHints: ["Vertical Hint 1", "Vertical Hint 2", "Vertical Hint 3"],
    horizontalHints: ["Horizontal Hint 1", "Horizontal Hint 2", "Horizontal Hint 3"],
    answer: ["word1", "word2", "word3"]
  };

  beforeEach(async () => {
    // Create mock MongoDB client
    mockMongoClient = new MockMongoClient();
    mockCollection = mockMongoClient.db().collection('puzzles');

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleController],
      providers: [
        {
          provide: MongoClient,
          useValue: mockMongoClient
        },
        {
          provide: PuzzleService,
          useFactory: (mongoClient: MongoClient) => {
            // You'll need to adjust this based on your actual PuzzleService implementation
            return {
              getAllPuzzles: jest.fn(),
              getPuzzle: jest.fn(),
              getPuzzleByDate: jest.fn()
            };
          },
          inject: [MongoClient]
        },
        {
          provide: CACHE_MANAGER,
          useValue: {}
        }
      ]
    }).compile();

    puzzleController = module.get<PuzzleController>(PuzzleController);
    puzzleService = module.get<PuzzleService>(PuzzleService);
  });

  describe('getAllPuzzles', () => {
    it('should return an array of puzzles', async () => {
      const puzzles: Puzzle[] = [mockPuzzle];
      
      // Setup mock for getAllPuzzles
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue(puzzles);
      jest.spyOn(puzzleService, 'getAllPuzzles').mockResolvedValue(puzzles);

      const result = await puzzleController.getAllPuzzles();
      expect(result).toBe(puzzles);
      expect(puzzleService.getAllPuzzles).toHaveBeenCalled();
    });

    it('should return an empty array when no puzzles exist', async () => {
      // Setup mock for empty puzzles
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue([]);
      jest.spyOn(puzzleService, 'getAllPuzzles').mockResolvedValue([]);

      const result = await puzzleController.getAllPuzzles();
      expect(result).toEqual([]);
    });
  });

  describe('getPuzzle', () => {
    it('should return a single puzzle by ID', async () => {
      // Setup mock for getPuzzle
      mockCollection.findOne.mockResolvedValue(mockPuzzle);
      jest.spyOn(puzzleService, 'getPuzzle').mockResolvedValue(mockPuzzle);

      const result = await puzzleController.getPuzzle('65f8a1b3e4b0f7e3c8d0e1f2');
      expect(result).toBe(mockPuzzle);
      expect(puzzleService.getPuzzle).toHaveBeenCalledWith('65f8a1b3e4b0f7e3c8d0e1f2');
    });

    it('should return null if puzzle is not found', async () => {
      // Setup mock for puzzle not found
      mockCollection.findOne.mockResolvedValue(null);
      jest.spyOn(puzzleService, 'getPuzzle').mockResolvedValue(null);

      const result = await puzzleController.getPuzzle('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getPuzzleByDate', () => {
    it('should return a puzzle for a specific date', async () => {
      // Setup mock for getPuzzleByDate
      mockCollection.findOne.mockResolvedValue(mockPuzzle);
      jest.spyOn(puzzleService, 'getPuzzleByDate').mockResolvedValue(mockPuzzle);

      const result = await puzzleController.getPuzzleByDate('2024-10-07');
      expect(result).toBe(mockPuzzle);
      expect(puzzleService.getPuzzleByDate).toHaveBeenCalledWith('2024-10-07');
    });

    it('should return null if no puzzle exists for the date', async () => {
      // Setup mock for no puzzle found by date
      mockCollection.findOne.mockResolvedValue(null);
      jest.spyOn(puzzleService, 'getPuzzleByDate').mockResolvedValue(null);

      const result = await puzzleController.getPuzzleByDate('2024-01-01');
      expect(result).toBeNull();
    });
  });
});