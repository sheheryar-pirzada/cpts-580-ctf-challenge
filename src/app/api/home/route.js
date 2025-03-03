import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../prisma/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {

  const cookieStore = cookies();
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

  const completedChallenges = completions.map((completion) => completion.challenge);

  const pointsEarned = completions.reduce(
    (total, completion) => total + completion.challenge.points,
    0
  );

  const totalChallenges = await prisma.challenge.count();

  const yourRank = 12;

  const responseData = {
    totalChallenges,
    completedChallengesCount: completions.length,
    pointsEarned,
    yourRank,
    completedChallenges,
  };

  return NextResponse.json(responseData);
}

