import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../../../prisma/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const FLAG_3 = process.env.FLAG_3;

export async function POST(req, { params }) {
  const { id } = params;
  const { status } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }

  const requestingUserId = decoded.id;

  const targetUserId = Number(id);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status },
      select: { id: true, username: true, status: true },
    });

    if (requestingUserId !== targetUserId) {
      return NextResponse.json({
        message: `IDOR detected! You've successfully exploited this vulnerability. FLAG{${FLAG_3}}`,
        flag: FLAG_3,
        updatedUser,
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
