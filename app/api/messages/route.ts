import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 50;

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
          id: cursor.toString(),
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
    let nextCursor;
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
