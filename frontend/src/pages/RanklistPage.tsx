import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import trophyIcon from '../assets/trophy.png'; // Add a trophy icon for the top ranker

interface RankEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
}

const RanklistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get contest ID from the URL
  const [ranklist, setRanklist] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ranklist data from the backend
  useEffect(() => {
    const fetchRanklist = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/contests/${id}/ranklist`);
        setRanklist(response.data.ranklist);
        console.log('Ranklist:', response.data.ranklist); // Debug log
      } catch (err) {
        setError('Failed to load ranklist');
        console.error('Error fetching ranklist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanklist();
  }, [id]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  // Show error message if data fetch fails
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-pink-600">
        <p className="text-white text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse">
        🏆 Final Ranklist 🏆
      </h1>
      <div className="overflow-x-auto shadow-2xl rounded-lg bg-white">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left">Rank</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranklist.map((entry) => (
              <tr
                key={entry.user_id}
                className={`hover:bg-gray-100 ${
                  entry.rank === 1 ? 'bg-yellow-100' : ''
                }`}
              >
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {entry.rank === 1 ? (
                    <img
                      src={trophyIcon}
                      alt="Trophy"
                      className="inline-block h-6 w-6 mr-2"
                    />
                  ) : (
                    <span className="font-bold">{entry.rank}</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  {entry.username}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center font-bold text-lg">
                  {entry.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default RanklistPage;