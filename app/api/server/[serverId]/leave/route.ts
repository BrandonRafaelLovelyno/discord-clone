import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    if (!params.serverId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Invalid session");
    }
    const leftServer = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: session.user.profileId,
        },
        members: {
          some: {
            profileId: session.user.profileId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: session.user.profileId,
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
    if (!leftServer) {
      throw new Error("Invalid serverId");
    }
    return NextResponse.json({
      success: true,
      message: "",
      data: leftServer,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
