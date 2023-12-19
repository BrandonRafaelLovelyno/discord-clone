import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { content } = await req.json();
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const updatedMessage = await prismadb.message.update({
      where: {
        id: params.messageId,
        member: {
          profileId: session.user.profileId,
        },
      },
      data: {
        content: content,
      },
    });
    if (!updatedMessage) {
      throw new Error("Invalid messageId");
    }
    return NextResponse.json({
      success: true,
      message: "",
      data: updatedMessage,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
