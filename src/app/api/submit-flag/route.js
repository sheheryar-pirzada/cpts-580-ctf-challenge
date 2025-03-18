import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "../../../../prisma/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { flag } = body;

    if (!flag) {
      return NextResponse.json({ error: "Flag is required" }, { status: 400 });
    }

    // Check if user is authenticated via cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in to submit flags." }, { status: 401 });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid user." }, { status: 401 });
    }

    // Check if the flag exists in the challenge database
    const challenge = await prisma.challenge.findFirst({
      where: { correctFlag: flag },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Invalid flag. Try again!" }, { status: 400 });
    }

    // Check if the user has already completed the challenge
    const existingCompletion = await prisma.challengeCompletion.findFirst({
      where: { userId: user.id, challenge: {
        name: challenge.name,
        } },
    });

    if (existingCompletion) {
      return NextResponse.json({ error: "Challenge already completed!" }, { status: 400 });
    }

    // Record challenge completion
    await prisma.challengeCompletion.create({
      data: {
        flag: flag,
        user: {
          connect: { id: user.id },
        },
        challenge: {
          connect: { name: challenge.name },
        },
      },
    });

    return NextResponse.json({ message: `Flag accepted! You earned ${challenge.points} points.` }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
