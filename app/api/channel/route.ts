import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { ChannelType, MemberRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    const { name, type } = (await req.json()) as {
      name: string;
      type: ChannelType;
    };
    if (!name || !type || !serverId || !(type in ChannelType)) {
      throw new Error("Missing fields");
    }
    const server = await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: session.user.profileId,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: session.user.profileId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
        channels: true,
      },
    });
    if (!server) {
      throw new Error("Invalid serverId or Unauthorized");
    }
    return NextResponse.json({
      success: true,
      message: "",
      data: server,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
        data: {},
      },
      { status: 400 }
    );
  }
}
