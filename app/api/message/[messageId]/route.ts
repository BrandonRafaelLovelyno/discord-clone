import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { MemberRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    const { content, fileUrl } = await req.json();
    if (!content || !serverId) {
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
    const message = await prismadb.message.findUnique({
      where: {
        id: params.messageId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return NextResponse.json({
        success: false,
        message: "Invalid messageId",
        data: {},
      });
    }
    const isOwner = currentMember.profileId == message.member.profileId;
    const isAdmin = currentMember.role == MemberRole.ADMIN;
    const isModerator = currentMember.role == MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;
    if (!canModify) {
      throw new Error("Unauthorized");
    }
    const updatedMessage = await prismadb.message.update({
      where: {
        id: message.id,
      },
      data: {
        content,
        fileUrl,
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
        message: updatedMessage,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const serverId = url.searchParams.get("serverId");
    if (!serverId) {
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
    const message = await prismadb.message.findUnique({
      where: {
        id: params.messageId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return NextResponse.json({
        success: false,
        message: "Invalid messageId",
        data: {},
      });
    }
    const isOwner = currentMember.profileId == message.member.profileId;
    const isAdmin = currentMember.role == MemberRole.ADMIN;
    const isModerator = currentMember.role == MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;
    if (!canModify) {
      throw new Error("Unauthorized");
    }
    const updatedMessage = await prismadb.message.update({
      where: {
        id: message.id,
      },
      data: {
        deleted: true,
        content: "This message has been deleted",
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
        message: updatedMessage,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}
