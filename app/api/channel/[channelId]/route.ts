import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { MemberRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    if (!serverId || !params.channelId) {
      throw new Error("Missing fields");
    }
    const { name, type } = await req.json();
    if (!name || !type) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const updatedServer = await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: session.user.profileId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!updatedServer) {
      throw new Error("Invalid channelId");
    }
    return NextResponse.json({
      success: true,
      data: updatedServer,
      message: "",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
