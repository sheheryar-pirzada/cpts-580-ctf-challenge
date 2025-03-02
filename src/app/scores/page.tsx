"use client"

import Scoreboard from "@/components/Scoreboard";
import {InteractiveGridPattern} from "@/components/magicui/InteractiveGridPattern";
import {cn} from "@/lib/utils";
import { useEffect, useState } from "react";

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
    <div className="absolute flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12",
        )}
      />
      <div className="z-30 w-1/2">
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
  )
}
