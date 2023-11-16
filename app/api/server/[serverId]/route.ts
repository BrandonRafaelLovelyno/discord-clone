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

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const { name, imageUrl } = await req.json();
    if (!name || (name as string).length < 1) {
      throw new Error("Unproper fields");
    }
    let updatedServer = null;
    if (!imageUrl) {
      updatedServer = await prismadb.server.update({
        where: {
          id: params.serverId,
          members: {
            some: {
              profileId: session.user.profileId,
            },
          },
        },
        data: {
          name,
        },
      });
    } else {
      updatedServer = await prismadb.server.update({
        where: {
          id: params.serverId,
          members: {
            some: {
              profileId: session.user.profileId,
            },
          },
        },
        data: {
          name,
          imageUrl,
        },
      });
    }
    if (!updatedServer) {
      throw new Error("Server not found");
    }
    console.log("returned", updatedServer);
    return NextResponse.json({
      success: true,
      message: "",
      data: updatedServer,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
