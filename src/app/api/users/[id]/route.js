import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, username: true, status: true, createdAt: true },
    });


    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
