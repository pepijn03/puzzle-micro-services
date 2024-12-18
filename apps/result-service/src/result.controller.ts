import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from '../objects/result.interface';

@Controller('/results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  async getAllResults(): Promise<Result[]> {
    return this.resultService.getAllResults();
  }

  @Get('/puzzle/:puzzleId')
  async getResultsByPuzzle(@Param('puzzleId') puzzleId: string): Promise<Result[]> {
    return this.resultService.getResultsByPuzzle(puzzleId);
  }

  @Get('/user/:userName')
  async getResultsByUser(@Param('userName') userName: string): Promise<Result[]> {
    return this.resultService.getResultByUser(userName);
  }

  @Post('/add')
  async addResult(@Body() result: Result): Promise<void> {
    return this.resultService.addResult(result);
  }

  // Keeping the existing hello world method from the test
  getHello(): string {
    return 'Hello World!';
  }
}