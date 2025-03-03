import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        name: true,
        points: true,
        difficulty: true,
        description: true,
        ChallengeCompletion: true,
      },
    });

    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching challenges data' },
      { status: 500 }
    );
  }
}
