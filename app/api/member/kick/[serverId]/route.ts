import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");
    if (!params.serverId || !memberId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const updatedServer = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: session.user.profileId,
        members: {
          some: {
            id: memberId,
          },
        },
      },
      data: {
        members: {
          delete: {
            id: memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!updatedServer) {
      throw new Error("Server not found");
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
