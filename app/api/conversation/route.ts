import options from "@/lib/auth/option";
import { getOrCreateConversation } from "@/lib/conversation";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");
    if (!memberId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const profile = await prismadb.profile.findUnique({
      where: {
        id: session.user.profileId,
      },
    });
    if (!profile) {
      throw new Error("Unauthorized");
    }
    const conversation = await getOrCreateConversation(profile.id, memberId);
    const otherMember =
      profile.id == conversation.memberOneId
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
