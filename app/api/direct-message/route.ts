import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const DIRECT_MESSAGE_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");
    const cursor = url.searchParams.get("cursor");
    if (!conversationId || !cursor) {
      throw new Error("Missing fields");
    }
    let direct_messages;
    if (cursor !== "-1") {
      direct_messages = await prismadb.directMessage.findMany({
        where: {
          conversationId: conversationId,
        },
        take: DIRECT_MESSAGE_BATCH,
        cursor: {
          id: cursor,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        skip: 0,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      direct_messages = await prismadb.directMessage.findMany({
        where: {
          conversationId: conversationId,
        },
        take: DIRECT_MESSAGE_BATCH,
        skip: 0,
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
    if (direct_messages.length == DIRECT_MESSAGE_BATCH) {
      nextCursor = direct_messages[DIRECT_MESSAGE_BATCH - 1].id;
    }
    console.log(direct_messages);
    return NextResponse.json({
      success: true,
      message: "",
      data: {
        messages: direct_messages,
        nextCursor: nextCursor,
      },
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");
    const { content, fileUrl } = await req.json();
    if (!conversationId || !content) {
      throw new Error("Missing fields");
    }
    const currentMember = await prismadb.member.findFirst({
      where: {
        profileId: session.user.profileId,
      },
    });
    if (!currentMember) {
      throw new Error("Unauthorized");
    }
    const newMessage = await prismadb.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId,
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
      success: true,
      message: "",
      data: {
        message: newMessage,
      },
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
