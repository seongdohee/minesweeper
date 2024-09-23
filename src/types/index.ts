export interface MineTileConfig {
  hasMine: boolean;
  hasFlag: boolean;
  isRevealed: boolean;
  adjacentMines: number;
}

export type Level = 'easy' | 'normal' | 'hard';

export interface LevelConfig {
  label: string;
  value: Level;
  rows: number;
  cols: number;
  mine: number;
}

export type GameStatus = 'default' | 'processing' | 'completed' | 'failed';