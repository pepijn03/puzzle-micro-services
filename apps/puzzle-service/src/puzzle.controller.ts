import { Controller, Get, Param, Post, Body, UseInterceptors, Logger } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PuzzleService } from './puzzle.service';
import { Puzzle } from '../objects/puzzle.interface';

@Controller()
export class PuzzleController {
  private readonly logger = new Logger(PuzzleController.name);

  constructor(
    private readonly service: PuzzleService,
  ) {}

  @CacheTTL(30) // override TTL to 30 seconds
  @Get()
  async getAllPuzzles(): Promise<Puzzle[]> {
    this.logger.log('Fetching all puzzles');
    const puzzles = await this.service.getAllPuzzles();
    this.logger.log(`Fetched ${puzzles.length} puzzles`);
    return puzzles;
  }

  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('/:id')
  async getPuzzle(@Param('id') id: string): Promise<Puzzle> {
    this.logger.log(`Fetching puzzle with id: ${id}`);
    const puzzle = await this.service.getPuzzle(id);
    if(!puzzle) {
      this.logger.log(`No puzzle found with id: ${id}`);
      return null;
    }
    else{
      this.logger.log(`Fetched puzzle with id: ${puzzle.id}`);
    return puzzle;
    }
  }

  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('/date/:day')
  async getPuzzleByDate(@Param('day') day: string): Promise<Puzzle> {
    this.logger.log(`Fetching puzzle for date: ${day}`);
    const puzzle = await this.service.getPuzzleByDate(day);
    if(!puzzle) {
      this.logger.log(`No puzzle found for date: ${day}`);
      return null;
    }
    else {
      this.logger.log(`Fetched puzzle with date: ${puzzle.date}`);
      return puzzle;
    }
  }

  @Post('/add')
  async addPuzzle(@Body() puzzle: Puzzle): Promise<string> {
    this.logger.log('Adding a new puzzle');
    await this.service.addPuzzle(puzzle);
    this.logger.log(`Added puzzle for date: ${puzzle.date}`);
    return `Added puzzle for date: ${puzzle.date}`;
  }
}
