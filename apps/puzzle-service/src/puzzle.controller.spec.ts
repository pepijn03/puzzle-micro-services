import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleController } from './puzzle.controller';
import { PuzzleService } from './puzzle.service';
import { RabbitMQProducerService } from './producer.service';
import { Puzzle } from '../objects/puzzle.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PuzzleController', () => {
  let puzzleController: PuzzleController;
  let puzzleService: PuzzleService;
  let rabbitMQProducerService: RabbitMQProducerService;

  const mockPuzzle: Puzzle = {
    id: '65f8a1b3e4b0f7e3c8d0e1f2',
    date: '2024-10-07',
    verticalHints: ["Vertical Hint 1", "Vertical Hint 2", "Vertical Hint 3"],
    horizontalHints: ["Horizontal Hint 1", "Horizontal Hint 2", "Horizontal Hint 3"],
    answer: ["word1", "word2", "word3"]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleController],
      providers: [
        {
          provide: PuzzleService,
          useValue: {
            getAllPuzzles: jest.fn(),
            getPuzzle: jest.fn(),
            getPuzzleByDate: jest.fn()
          }
        },
        {
          provide: RabbitMQProducerService,
          useValue: {
            sendMessage: jest.fn()
          }
        },
        {
          provide: CACHE_MANAGER,
          useValue: {}
        }
      ]
    }).compile();

    puzzleController = module.get<PuzzleController>(PuzzleController);
    puzzleService = module.get<PuzzleService>(PuzzleService);
    rabbitMQProducerService = module.get<RabbitMQProducerService>(RabbitMQProducerService);
  });

  describe('getAllPuzzles', () => {
    it('should return an array of puzzles', async () => {
      const puzzles: Puzzle[] = [mockPuzzle];
      jest.spyOn(puzzleService, 'getAllPuzzles').mockResolvedValue(puzzles);

      const result = await puzzleController.getAllPuzzles();
      expect(result).toBe(puzzles);
      expect(puzzleService.getAllPuzzles).toHaveBeenCalled();
    });

    it('should return an empty array when no puzzles exist', async () => {
      jest.spyOn(puzzleService, 'getAllPuzzles').mockResolvedValue([]);

      const result = await puzzleController.getAllPuzzles();
      expect(result).toEqual([]);
    });
  });

  describe('getPuzzle', () => {
    it('should return a single puzzle by ID', async () => {
      jest.spyOn(puzzleService, 'getPuzzle').mockResolvedValue(mockPuzzle);

      const result = await puzzleController.getPuzzle('65f8a1b3e4b0f7e3c8d0e1f2');
      expect(result).toBe(mockPuzzle);
      expect(puzzleService.getPuzzle).toHaveBeenCalledWith('65f8a1b3e4b0f7e3c8d0e1f2');
    });

    it('should return null if puzzle is not found', async () => {
      jest.spyOn(puzzleService, 'getPuzzle').mockResolvedValue(null);

      const result = await puzzleController.getPuzzle('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getPuzzleByDate', () => {
    it('should return a puzzle for a specific date', async () => {
      jest.spyOn(puzzleService, 'getPuzzleByDate').mockResolvedValue(mockPuzzle);

      const result = await puzzleController.getPuzzleByDate('2024-10-07');
      expect(result).toBe(mockPuzzle);
      expect(puzzleService.getPuzzleByDate).toHaveBeenCalledWith('2024-10-07');
    });

    it('should return null if no puzzle exists for the date', async () => {
      jest.spyOn(puzzleService, 'getPuzzleByDate').mockResolvedValue(null);

      const result = await puzzleController.getPuzzleByDate('2024-01-01');
      expect(result).toBeNull();
    });
  });

  describe('sendMessage', () => {
    it('should send a message via RabbitMQ', async () => {
      const message = { test: 'message' };
      const sendMessageSpy = jest.spyOn(rabbitMQProducerService, 'sendMessage').mockResolvedValue(undefined);

      const result = await puzzleController.sendMessage(message);
      
      expect(sendMessageSpy).toHaveBeenCalledWith('my_pattern', message);
      expect(result).toEqual({ status: 'Message sent' });
    });
  });
});