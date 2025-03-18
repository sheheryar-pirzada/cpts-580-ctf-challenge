"use client"

import {useEffect, useState} from 'react';
import Header from "@/components/layout/Header";

interface Challenge {
  id: string;
  // other properties if needed
}

interface DashboardData {
  completedChallenges: Challenge[];
  completedChallengesCount: number;
  pointsEarned: number;
  yourRank: number;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch data');
        }
        const dashboardData: DashboardData = await res.json();
        setData(dashboardData);
      } catch (err) {
        // @ts-expect-error xyz
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch('/api/challenges');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch data');
        }
        const d: Challenge[] = await res.json();
        setChallenges(d);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const hasCompleted = (challenge: Challenge) => {
    if (data) {
      return data.completedChallenges.some((c) => c.id === challenge.id);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Challenges</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold">{data?.completedChallengesCount || "N/A"}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Points Earned</p>
            <p className="text-2xl font-bold">{data?.pointsEarned || "N/A"}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Your Rank</p>
            <p className="text-2xl font-bold">{`#${data?.yourRank || "N/A"}`}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data && challenges.map((challenge) => (
            <div key={challenge.id} className="p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg overflow-hidden shadow-lg animate-gradient-x">
              <div className={`bg-gray-800 rounded-lg h-full ${challenge.completed ? 'ring-2 ring-green-500' : ''}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{challenge.name}</h3>
                    <div className="flex justify-evenly">
                      <span className={`text-xs mr-2 font-medium px-2 py-1 rounded-full ${
                        challenge.difficulty === "EASY" ? "bg-green-900/50 text-green-400" :
                          challenge.difficulty === "MEDIUM" ? "bg-yellow-900/50 text-yellow-400" :
                            "bg-red-900/50 text-red-400"
                      }`}>
                        {challenge.difficulty}
                      </span>
                      {hasCompleted(challenge) && (
                        <span className="bg-green-600 text-xs font-medium px-2 py-1 rounded-full">Completed</span>
                      )}
                    </div>

                  </div>
                  <p className="text-gray-400 mt-2 text-sm">{challenge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
