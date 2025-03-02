import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/prisma";

export async function POST(req) {
  try {
    const body = await req.json(); // Read request body
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken!" }, { status: 400 });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: { id: newUser.id, username: newUser.username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
