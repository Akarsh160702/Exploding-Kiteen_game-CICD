import { useState } from 'react';
import { Cat } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { login } from '../store/gameSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      dispatch(login(username.trim()));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="flex flex-col items-center mb-8">
          <Cat className="w-16 h-16 text-indigo-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Exploding Kittens</h1>
          <p className="text-gray-600">Enter your username to start playing</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Playing
          </button>
        </form>
      </div>
    </div>
  );
}