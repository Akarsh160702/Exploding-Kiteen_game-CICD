export type CardType = 'cat' | 'defuse' | 'shuffle' | 'explode';

export interface Card {
  id: string;
  type: CardType;
}

export interface GameState {
  username: string;
  isLoggedIn: boolean;
  deck: Card[];
  drawnCards: Card[];
  hasDefuse: boolean;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  score: number;
  shuffleInProgress: boolean;
  showingExplodingCard: boolean;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
}