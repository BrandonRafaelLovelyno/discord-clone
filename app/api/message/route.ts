import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 10;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const channelId = url.searchParams.get("channelId");
    const cursor = url.searchParams.get("cursor");
    if (!channelId || !cursor) {
      throw new Error("Missing fields");
    }
    if (!cursor) {
      throw new Error("Invalid cursor");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    let messages;
    if (cursor != "-1") {
      messages = await prismadb.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (messages.length == MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }
    return NextResponse.json({
      data: {
        messages,
        nextCursor,
      },
      message: "",
      success: true,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    const channelId = url.searchParams.get("channelId");
    if (!channelId || !serverId) {
      throw new Error("Missing fields");
    }
    const { content, fileUrl } = await req.json();
    if (!content || !serverId || !channelId) {
      throw new Error("Missing fields");
    }
    const currentMember = await prismadb.member.findFirst({
      where: {
        profileId: session.user.profileId,
        serverId: serverId,
      },
    });
    if (!currentMember) {
      throw new Error("Member not found");
    }
    const newMessage = await prismadb.message.create({
      data: {
        content,
        fileUrl,
        channelId,
        memberId: currentMember.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    return NextResponse.json({
      data: {
        message: newMessage,
      },
      message: "",
      success: true,
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
