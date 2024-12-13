import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { startGame, drawCard, completeShuffle, completeExplosion, logout } from '../store/gameSlice';
import Card from './Card';

export default function GameBoard() {
  const dispatch = useAppDispatch();
  const { 
    deck, 
    drawnCards, 
    hasDefuse, 
    gameStatus, 
    username, 
    score,
    shuffleInProgress,
    showingExplodingCard
  } = useAppSelector((state) => state.game);

  const gamesPlayed = parseInt(sessionStorage.getItem('gamesPlayed') || '0', 10);
  const nextGameNumber = gamesPlayed + 1;
  const isNextGameThird = nextGameNumber % 3 === 0;

  useEffect(() => {
    if (shuffleInProgress) {
      const timer = setTimeout(() => {
        dispatch(completeShuffle());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shuffleInProgress, dispatch]);

  useEffect(() => {
    if (showingExplodingCard) {
      const timer = setTimeout(() => {
        dispatch(completeExplosion());
      }, 1500); // Show exploding card for 1.5 seconds before game over
      return () => clearTimeout(timer);
    }
  }, [showingExplodingCard, dispatch]);

  const handleStartGame = () => {
    dispatch(startGame());
  };

  const handleDrawCard = () => {
    if (gameStatus === 'playing' && deck.length > 0 && !shuffleInProgress && !showingExplodingCard) {
      dispatch(drawCard());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-gray-600">Player</div>
            <div className="font-bold text-lg text-gray-900">{username}</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
        <div className="text-sm text-gray-600">Score</div>
        <div className="font-bold text-lg text-indigo-600">{score}</div>
        <div className="text-xs text-gray-500 mt-1">
          Game {nextGameNumber} {isNextGameThird && '(Lucky game!)'}
        </div>
      </div>

      {gameStatus === 'idle' && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleStartGame}
          className="bg-white text-indigo-600 px-8 py-4 rounded-lg shadow-lg font-bold text-xl"
        >
          Start Game
        </motion.button>
      )}

      {(gameStatus === 'playing' || showingExplodingCard) && (
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow text-gray-900">
              <span className="text-gray-600">Cards left:</span>{' '}
              <span className="font-bold">{deck.length}</span>
            </div>
            {hasDefuse && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="font-bold">Defuse Ready</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
            <AnimatePresence mode="popLayout">
              {drawnCards.map((card, index) => (
                <motion.div
                  key={`${card.id}-${index}`}
                  initial={{ scale: 0, y: 100 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -100 }}
                  layout
                >
                  <Card type={card.type} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {deck.length > 0 && !shuffleInProgress && !showingExplodingCard && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDrawCard}
              className="cursor-pointer"
            >
              <Card type="cat" isRevealed={false} />
            </motion.div>
          )}
        </div>
      )}

      {(gameStatus === 'won' || gameStatus === 'lost') && !showingExplodingCard && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {gameStatus === 'won' ? '🎉 You Won!' : '💥 Game Over!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {gameStatus === 'won'
              ? 'Congratulations! You successfully avoided all the exploding kittens!'
              : 'Oh no! You found an exploding kitten without a defuse card!'}
          </p>
          <button
            onClick={handleStartGame}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}