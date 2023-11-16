import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { MemberRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");
    if (!memberId) {
      throw new Error("Missing fields");
    }
    const { role } = await req.json();
    if (!role) {
      throw new Error("Missing fields");
    }
    const updatedServer = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: session.user.profileId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role: role as MemberRole,
            },
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
      data: updatedServer,
      success: true,
      message: "",
    });
  } catch (err) {
    return NextResponse.json({
      message: (err as Error).message,
      success: false,
      data: {},
    });
  }
}
