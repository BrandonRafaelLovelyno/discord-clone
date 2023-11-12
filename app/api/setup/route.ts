import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user?.email!,
      },
    });
    if (!currentUser) {
      throw new Error("Unauthorized");
    }
    const newProfile = await prismadb.profile.upsert({
      where: {
        userId: currentUser.id,
      },
      create: {
        email: currentUser.email!,
        imageUrl: currentUser.image || "",
        name: currentUser.name!,
        userId: currentUser.id,
      },
      update: {
        name: currentUser.email || "",
        imageUrl: currentUser.image || "",
      },
    });
    const returnedServer = await prismadb.server.findFirst({
      where: {
        members: {
          some: {
            profileId: newProfile.id,
          },
        },
      },
    });
    return NextResponse.json({
      data: returnedServer,
      success: true,
      message: "",
    });
  } catch (err) {
    return NextResponse.json({
      data: {},
      success: false,
      message: (err as Error).message,
    });
  }
}
