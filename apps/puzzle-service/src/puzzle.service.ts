import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Puzzle } from '../objects/puzzle.interface';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

@Injectable()
export class PuzzleService {
    private collection: any;

    constructor(
        @Inject(CACHE_MANAGER) private cacheService: Cache,
        @Inject('MONGO_CLIENT') private client: MongoClient,
        @Inject('DATABASE_NAME') private databaseName: string,
        @Inject('COLLECTION_NAME') private collectionName: string
    ) {
        this.collection = this.client.db(this.databaseName).collection(this.collectionName);
    }

    async getAllPuzzles(): Promise<Puzzle[]> {
        await this.client.connect();
        const res = await this.collection
            .find()
            .toArray() as Puzzle[];
        return res;
    }

    async getPuzzle(id: string): Promise<Puzzle> {
        // check if data is in cache:
        const cachedData = await this.cacheService.get<{ puzzle: Puzzle }>(id.toString());
        if (cachedData) {
            console.log(`Getting data from cache!`);
            return cachedData.puzzle;
        }
        else {
            // if not, call data and set the cache: 
            // search in the database
            const res = await this.collection
                .findOne({ _id: new ObjectId(id) }) as Puzzle;

            // set the cache:            
            await this.cacheService.set(id.toString(), res);
            console.log(`Put data in cache!`);
            return res;
        }
    }

    async getPuzzleByDate(day: string): Promise<Puzzle> {
        await this.client.connect();
        const res = await this.collection
            .findOne({ date: day }) as Puzzle;
        return res;
    }
}