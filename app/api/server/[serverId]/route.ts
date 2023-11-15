import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    if (!params.serverId) {
      throw new Error("Missing field");
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
      throw new Error("Invalid profileId");
    }
    const server = await prismadb.server.findUnique({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!server) {
      throw new Error("Not a member");
    }
    const role = server.members.find((m) => m.profileId === profile.id)?.role;
    console.log("channel problem", server);
    return NextResponse.json({
      data: { server, role },
      success: true,
      message: "",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
