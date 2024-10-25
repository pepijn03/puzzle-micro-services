import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleController } from './puzzle.controller';
import { PuzzleService } from './puzzle.service';
import { puzzle } from '../objects/puzzle.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PuzzleController', () => {
    let puzzleController: PuzzleController;
  
    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [PuzzleController],
        providers: [PuzzleService, { provide: CACHE_MANAGER, useValue: {} }],
      }).compile();
  
      puzzleController = app.get<PuzzleController>(PuzzleController);
    });
  
    describe('getAll', () => {
      it('should return an array of puzzles', async () => {
        const result: puzzle[] = [];
        jest.spyOn(puzzleController, 'getAllPuzzles').mockImplementation(() => Promise.resolve(result));
        expect(await puzzleController.getAllPuzzles()).toBe(result);
      });
    });

    describe('getById', () => {
        it('should return a single puzzle', async () => {
          const result : puzzle = {id : 1, date: '2024-10-07', verticalHints: ["vhint1", "vhint2", "vhint3"], horizontalHints: ["hhint1", "hhint2", "hhint3"], answer: ["word1", "word2", "word3"]};
          jest.spyOn(puzzleController, 'getPuzzle').mockImplementation(() => Promise.resolve(result));
          expect(await puzzleController.getPuzzle(1)).toBe(result);
        });
      });
  });
  