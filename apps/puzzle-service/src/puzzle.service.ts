import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { puzzle } from '../objects/puzzle.interface';

@Injectable()
export class PuzzleService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: Cache,
    ) {}

    private puzzles: puzzle[] = [
        {id : 1, date: '2024-10-07', verticalHints: ["vhint1", "vhint2", "vhint3"], horizontalHints: ["hhint1", "hhint2", "hhint3"], answer: ["word1", "word2", "word3"]},
        {id : 2, date: '2024-10-08', verticalHints: ["vhint1", "vhint2", "vhint3"], horizontalHints: ["hhint1", "hhint2", "hhint3"], answer: ["word1", "word2", "word3"]},
    ];

    async getAllPuzzles(): Promise<puzzle[]> {
        return this.puzzles;
    }

    async getPuzzle(id:number): Promise<puzzle> {
            // check if data is in cache:
        const cachedData = await this.cacheService.get<{ puzzle: puzzle }>(id.toString());
        if (cachedData) {
            console.log(`Getting data from cache!`);
            return cachedData.puzzle;
        }
        else {
            // if not, call data and set the cache: 
            const res = this.puzzles.find(puzzle => puzzle.id === id);
            await this.cacheService.set(id.toString(), res);
            console.log(`Put data in cache!`);
            return res;
        }
    }

    async getPuzzleByDate(day: string): Promise<puzzle> {
        return this.puzzles.find(puzzle => puzzle.date === day);
    }
}
