import options from "@/lib/auth/option";
import { getOrCreateConversation } from "@/lib/conversation";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");
    const serverId = url.searchParams.get("serverId");
    if (!memberId || !serverId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const theMember = await prismadb.member.findUnique({
      where: {
        id: memberId,
        serverId,
      },
    });
    const ourMember = await prismadb.member.findFirst({
      where: {
        serverId,
        profileId: session.user.profileId,
      },
    });
    if (!theMember || !ourMember) {
      throw new Error("Invalid memberId");
    }
    const conversation = await getOrCreateConversation(ourMember.id, memberId);
    const otherMember =
      ourMember.id == conversation.memberOneId
        ? conversation.memberTwo
        : conversation.memberOne;
    return NextResponse.json({
      success: true,
      message: "",
      data: { conversation, otherMember },
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
