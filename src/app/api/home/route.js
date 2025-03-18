import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../prisma/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET() {
  const cookieStore = await cookies();
  const token = await cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to submit flags." },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const completions = await prisma.challengeCompletion.findMany({
    where: { userId: user.id },
    include: { challenge: true },
  });

  const pointsEarned = completions.reduce(
    (total, completion) => total + completion.challenge.points,
    0
  );

  const userPoints = await prisma.user.findMany({
    select: {
      id: true,
      ChallengeCompletion: {
        select: {
          challenge: {
            select: { points: true }
          }
        }
      }
    }
  });

  const userRanks = userPoints.map((u) => ({
    id: u.id,
    totalPoints: u.ChallengeCompletion.reduce(
      (sum, comp) => sum + (comp.challenge.points || 0),
      0
    ),
  }));

  userRanks.sort((a, b) => b.totalPoints - a.totalPoints);

  const yourRank = userRanks.findIndex((u) => u.id === user.id) + 1;

  const totalChallenges = await prisma.challenge.count();

  const responseData = {
    totalChallenges,
    completedChallengesCount: completions.length,
    pointsEarned,
    yourRank,
    completedChallenges: completions.map((completion) => completion.challenge),
  };

  return NextResponse.json(responseData);
}
