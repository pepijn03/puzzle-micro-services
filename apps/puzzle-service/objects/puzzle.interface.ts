export interface Puzzle {
    id: string;
    date: string;
    verticalHints: Array<string>;
    horizontalHints: Array<string>;
    answer: Array<string>;  
  }