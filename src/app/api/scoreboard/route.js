import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        ChallengeCompletion: {
          include: {
            challenge: true,
          },
        },
      },
    });

    const scoreboard = users.map((user) => ({
      username: user.username,
      challengesCompleted: user.ChallengeCompletion.length,
      totalPoints: user.ChallengeCompletion.reduce(
        (sum, completion) => sum + completion.challenge.points,
        0
      ),
    }));

    return NextResponse.json({ scoreboard }, { status: 200 });
  } catch (error) {
    console.error("Error fetching scoreboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
