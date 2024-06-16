import prismadb from "@/lib/orm/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    if (!server) {
      throw new Error("Invalid serverId");
    }
    return NextResponse.json({ success: true, message: "", data: server });
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
