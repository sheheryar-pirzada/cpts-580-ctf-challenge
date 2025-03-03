"use client"

import Scoreboard from "@/components/Scoreboard";
import { InteractiveGridPattern } from "@/components/magicui/InteractiveGridPattern";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";

export default function ScoresPage() {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScoreboard() {
      try {
        const response = await fetch("/api/scoreboard");
        const data = await response.json();
        setScoreboard(data.scoreboard);
      } catch (error) {
        console.error("Error fetching scoreboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchScoreboard();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Full-page grid pattern */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "w-full h-full"
          )}
        />
      </div>

      {/* Content above the grid pattern */}
      <div className="relative">
        <Header />
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <h2 className="text-gray-200 text-4xl text-center">Loading Scores...</h2>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-gray-200 text-center">🏆 Scoreboard</h2>
              <Scoreboard scores={scoreboard} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
