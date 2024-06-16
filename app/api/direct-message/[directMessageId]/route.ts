import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      directMessageId: string;
    };
  }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const { content, fileUrl } = await req.json();
    if (!content) {
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
    const newDirectMessage = await prismadb.directMessage.update({
      where: {
        id: params.directMessageId,
        memberId: currentMember.id,
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
        directMessage: newDirectMessage,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      directMessageId: string;
    };
  }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const currentMember = await prismadb.member.findFirst({
      where: {
        profileId: session.user.profileId,
      },
    });
    if (!currentMember) {
      throw new Error("Unauthorized");
    }
    const newDirectMessage = await prismadb.directMessage.update({
      where: {
        id: params.directMessageId,
        memberId: currentMember.id,
      },
      data: {
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
        directMessage: newDirectMessage,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
    });
  }
}
