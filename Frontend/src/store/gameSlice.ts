import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Card, CardType } from '../types/game';
import axios from "axios";

const generateCard = (type: CardType): Card => ({
  id: Math.random().toString(36).substring(7),
  type,
});

const getGamesPlayed = (): number => {
  return parseInt(sessionStorage.getItem('gamesPlayed') || '0', 10);
};

const incrementGamesPlayed = (): number => {
  const current = getGamesPlayed();
  const next = current + 1;
  sessionStorage.setItem('gamesPlayed', next.toString());
  return next;
};

const createInitialDeck = (): Card[] => {
  const gamesPlayed = getGamesPlayed();
  const isThirdGame = (gamesPlayed + 1) % 3 === 0;

  if (isThirdGame) {
    return [
      generateCard('cat'),
      generateCard('cat'),
      generateCard('defuse'),
      generateCard('cat'),
      generateCard('cat'),
    ];
  }

  const cards: Card[] = [
    generateCard('cat'),
    generateCard('cat'),
    generateCard('defuse'),
    generateCard('shuffle'),
    generateCard('explode'),
  ];
  return shuffleDeck(cards);
};

const shuffleDeck = (cards: Card[]): Card[] => {
  const newCards = [...cards];
  for (let i = newCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
  }
  return newCards;
};

const saveGameState = (state: GameState) => {
  const { username } = state;
  if (!username) return;

  localStorage.setItem(`score_${username}`, state.score.toString());
  localStorage.setItem(`gameState_${username}`, JSON.stringify({
    deck: state.deck,
    drawnCards: state.drawnCards,
    hasDefuse: state.hasDefuse,
    gameStatus: state.gameStatus,
    score: state.score,
    shuffleInProgress: state.shuffleInProgress,
    showingExplodingCard: state.showingExplodingCard,
  }));
};

const loadGameState = (username: string): Partial<GameState> | null => {
  const savedState = localStorage.getItem(`gameState_${username}`);
  if (!savedState) return null;
  
  try {
    return JSON.parse(savedState);
  } catch {
    return null;
  }
};

const initialState: GameState = {
  username: '',
  isLoggedIn: false,
  deck: [],
  drawnCards: [],
  hasDefuse: false,
  gameStatus: 'idle',
  score: 0,
  shuffleInProgress: false,
  showingExplodingCard: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isLoggedIn = true;
      
      const savedState = loadGameState(action.payload);
      if (savedState) {
        Object.assign(state, savedState);
      } else {
        const savedScore = localStorage.getItem(`score_${action.payload}`);
        if (savedScore) {
          state.score = parseInt(savedScore, 10);
        }
      }
    },
    startGame: (state) => {
      state.deck = createInitialDeck();
      state.drawnCards = [];
      state.hasDefuse = false;
      state.gameStatus = 'playing';
      state.shuffleInProgress = false;
      state.showingExplodingCard = false;
      saveGameState(state);
    },
    drawCard: (state) => {
      if (state.deck.length === 0 || state.gameStatus !== 'playing' || state.showingExplodingCard) return;
      
      const card = state.deck[0];
      state.deck = state.deck.slice(1);
      state.drawnCards.push(card);

      switch (card.type) {
        case 'defuse':
          state.hasDefuse = true;
          break;
          
        case 'explode':
          if (state.hasDefuse) {
            state.hasDefuse = false;
            const position = Math.floor(Math.random() * state.deck.length);
            state.deck = [
              ...state.deck.slice(0, position),
              generateCard('explode'),
              ...state.deck.slice(position)
            ];
          } else {
            state.showingExplodingCard = true;
          }
          break;
          
        case 'shuffle':
          state.shuffleInProgress = true;
          break;
      }

      if (state.deck.length === 0 && state.gameStatus === 'playing' && !state.showingExplodingCard) {
        state.gameStatus = 'won';
        state.score += 1;
        incrementGamesPlayed();

        console.log("Game won, attempting to update score in Redis...");

        // Send a request to update the score in Redis
        axios.post("https://exploding-kitten-game-backend-go.onrender.com/update-score", {
          userId: state.username,
          incrementBy: 1
        }).then(response => {
          console.log("Score updated in Redis:", response.data);
        }).catch(error => {
          console.error("Failed to update score in Redis:", error);
        });
      }

      saveGameState(state);
    },
    completeExplosion: (state) => {
      if (state.showingExplodingCard) {
        state.gameStatus = 'lost';
        state.showingExplodingCard = false;
        incrementGamesPlayed();
        saveGameState(state);
      }
    },
    completeShuffle: (state) => {
      if (state.shuffleInProgress) {
        state.deck = createInitialDeck();
        state.drawnCards = [];
        state.hasDefuse = false;
        state.shuffleInProgress = false;
        saveGameState(state);
      }
    },
    logout: (state) => {
      saveGameState(state);
      return initialState;
    },
  },
});

export const { 
  login, 
  startGame, 
  drawCard, 
  completeExplosion,
  completeShuffle, 
  logout 
} = gameSlice.actions;
export default gameSlice.reducer;