import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // SQL Injection Prevention
    const sqlInjectionPatterns = [
      /--/, /;/, /' OR '/i, /'='/, /"=/, /' OR 1=1/, /" OR "1"="1"/, /UNION/i,
      /SELECT/i, /INSERT/i, /DELETE/i, /DROP/i, /UPDATE/i
    ];
    if (sqlInjectionPatterns.some((pattern) => pattern.test(username) || pattern.test(password))) {
      return NextResponse.json({ message: "SQL Injection detected!", flag: `FLAG{${process.env.FLAG_2}` });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hint = Buffer.from(process.env.HINT_1).toString("base64");

    const token = jwt.sign({ id: user.id, username: user.username, hintMessage: hint, hintURL: "/gallery" }, SECRET_KEY, { expiresIn: "1h" });

    await cookies().set("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ message: "Login successful!", username: user.username, token, id: user.id }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
