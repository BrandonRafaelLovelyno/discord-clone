import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { MemberRole } from "@prisma/client";
import { url } from "inspector";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
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

export async function GET(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    if (!params.channelId || !serverId) {
      throw new Error("Missing fields");
    }
    const channel = await prismadb.channel.findUnique({
      where: {
        id: params.channelId,
      },
    });
    const member = await prismadb.member.findFirst({
      where: {
        profileId: session.user.profileId,
        serverId,
      },
      include: {
        profile: true,
      },
    });
    if (!member) {
      throw new Error("Unauthorized");
    }
    return NextResponse.json({
      success: true,
      message: "",
      data: { channel, currentMember: member },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    if (!params.channelId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const deletedChannel = await prismadb.channel.delete({
      where: {
        id: params.channelId,
      },
    });
    if (!deletedChannel) {
      throw new Error("Invalid serverId");
    }
    return NextResponse.json({
      success: true,
      message: "",
      data: {},
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}
