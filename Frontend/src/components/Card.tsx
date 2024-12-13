import { motion } from 'framer-motion';
import { Cat, ShieldCheck, Shuffle, Bomb } from 'lucide-react';
import { CardType } from '../types/game';

interface CardProps {
  type: CardType;
  isRevealed?: boolean;
}

const cardIcons = {
  cat: Cat,
  defuse: ShieldCheck,
  shuffle: Shuffle,
  explode: Bomb,
};

const cardColors = {
  cat: 'bg-amber-500',
  defuse: 'bg-green-500',
  shuffle: 'bg-blue-500',
  explode: 'bg-red-500',
};

export default function Card({ type, isRevealed = true }: CardProps) {
  const Icon = cardIcons[type];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`relative w-32 h-48 rounded-xl shadow-lg ${
        isRevealed ? cardColors[type] : 'bg-indigo-600'
      } flex items-center justify-center transition-colors duration-300`}
    >
      {isRevealed ? (
        <div className="text-white flex flex-col items-center gap-2">
          <Icon size={48} className="text-white" />
          <span className="font-bold capitalize text-white">{type}</span>
        </div>
      ) : (
        <div className="text-white text-4xl font-bold">?</div>
      )}
    </motion.div>
  );
}