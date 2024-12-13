import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "../api/pointsApi";

interface LeaderboardEntry {
  username: string;
  score: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    console.log(
      "Leaderboard component mounted. Attempting to fetch leaderboard..."
    );

    const loadLeaderboard = async () => {
      const entries = await getLeaderboard();
      console.log("Leaderboard data fetched from backend:", entries);
      setLeaderboard(entries);
    };

    loadLeaderboard(); // Initial load
    const interval = setInterval(loadLeaderboard, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-64">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.username}
            className="flex justify-between items-center p-2 rounded bg-gray-50"
          >
            <span className="font-medium">
              {index + 1}. {entry.username}
            </span>
            <span className="text-indigo-600 font-bold">{entry.score}</span>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <p className="text-gray-500 text-center">No scores yet</p>
        )}
      </div>
    </div>
  );
}
