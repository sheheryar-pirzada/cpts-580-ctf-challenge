import { NumberTicker } from '@/components/magicui/NumberTicker';

export default function Scoreboard({ scores }) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg z-20">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left w-16">Rank</th>
            <th className="px-6 py-3 text-left w-1/3">Player</th>
            <th className="px-6 py-3 text-center w-1/4">Challenges</th>
            <th className="px-6 py-3 text-center w-1/4">Points</th>
          </tr>
          </thead>
          <tbody>
          {scores
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((item, index) => (
              <tr key={index} className="border-t border-gray-300 hover:bg-gray-300 text-gray-700">
                <td className="px-6 py-3 font-semibold">{index + 1}</td>
                <td className="px-6 py-3">{item.username}</td>
                <td className="px-6 py-3 text-center">{item.challengesCompleted}</td>
                <td className="px-6 py-3 font-bold text-blue-600 text-center">
                  {item.totalPoints > 0 ? (<NumberTicker className="text-blue-600" value={item.totalPoints} />) : item.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
