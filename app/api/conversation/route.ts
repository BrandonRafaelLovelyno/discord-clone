import options from "@/lib/auth/option";
import { getServerSession } from "next-auth";
import { init } from "next/dist/compiled/webpack/webpack";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("memberId");
    if (!memberId) {
      throw new Error("Missing fields");
    }
    const session = await getServerSession(options);
    if (!session) {
      throw new Error("Unauthorized");
    }
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
