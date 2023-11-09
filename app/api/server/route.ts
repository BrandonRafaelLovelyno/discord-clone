import { NextResponse } from "next/server";
import prismadb from "@/lib/orm/prismadb";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "@/lib/auth/option";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    if (!name || !imageUrl) {
      throw new Error("Please fill the fields properly");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const profile = await prismadb.profile.findUnique({
      where: {
        userId: session.user.userId,
      },
    });
    if (!profile) {
      throw new Error("Invalid userId");
    }
    const newServer = await prismadb.server.create({
      data: {
        profileId: profile.id,
        imageUrl: imageUrl as string,
        name: name as string,
        inviteCode: uuidv4(),
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
        channels: {
          create: [{ name: "General", profileId: profile.id }],
        },
      },
    });
    return NextResponse.json({ message: "", success: true, newServer });
  } catch (err) {
    return NextResponse.json({
      message: (err as Error).message,
      success: false,
      data: {},
    });
  }
}
