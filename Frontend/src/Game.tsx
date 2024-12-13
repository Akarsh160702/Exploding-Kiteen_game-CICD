import { useAppSelector } from "./hooks/redux";
import Login from "./components/Login";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";

export default function Game() {
  const isLoggedIn = useAppSelector((state) => state.game.isLoggedIn);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-10">
        <Leaderboard />
      </div>
      <GameBoard />
    </div>
  );
}
