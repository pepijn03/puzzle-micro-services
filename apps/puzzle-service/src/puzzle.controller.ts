import { Controller, Get, Param, Post, Body, UseInterceptors, Logger } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PuzzleService } from './puzzle.service';
import { RabbitMQProducerService } from './producer.service';
import { Puzzle } from '../objects/puzzle.interface';

@Controller()
export class PuzzleController {
  private readonly logger = new Logger(PuzzleController.name);

  constructor(
    private readonly service: PuzzleService,
    private readonly producerService: RabbitMQProducerService
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
    this.logger.log(`Fetched puzzle with id: ${puzzle.id}`);
    return puzzle;
  }

  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('/date/:day')
  async getPuzzleByDate(@Param('day') day: string): Promise<Puzzle> {
    this.logger.log(`Fetching puzzle for date: ${day}`);
    const puzzle = await this.service.getPuzzleByDate(day);
    this.logger.log(`Fetched puzzle with date: ${puzzle.date}`);
    return puzzle;
  }

  @Post('/msg')
  async sendMessage(@Body() message: any) {
    this.logger.log(`Sending message: ${JSON.stringify(message)}`);
    await this.producerService.sendMessage('my_pattern', message);
    this.logger.log('Message sent');
    return { status: 'Message sent' };
  }
}
