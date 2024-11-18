export interface Puzzle {
    id: number;
    date: string;
    verticalHints: Array<string>;
    horizontalHints: Array<string>;
    answer: Array<string>;  
  }