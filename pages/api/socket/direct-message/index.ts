import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { NextApiResponseServerIo } from "@/lib/types/socket";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({
        success: false,
        message: "Invalid method",
        data: {},
      });
    }
    const session = await getServerSession(req, res, options);
    if (!session) {
      return res
        .status(402)
        .json({ success: false, message: "Unauthorized", data: {} });
    }
    const { conversationId } = req.query;
    const { content, fileUrl } = req.body;

    if (!content || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
        data: {},
      });
    }
    const currentMember = await prismadb.member.findFirst({
      where: {
        profileId: session.user.profileId,
      },
    });
    if (!currentMember) {
      return res.status(400).json({
        success: false,
        message: "Invalid session",
        data: {},
      });
    }
    const newDirectMessage = await prismadb.directMessage.create({
      data: {
        conversationId: conversationId as string,
        content: content as string,
        fileUrl: fileUrl as string,
        memberId: currentMember.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const socketKey = `conversation:${conversationId}:direct-message`;

    res.socket.server.io.emit(socketKey, newDirectMessage);
    return res.status(200).json({
      success: true,
      message: "",
      data: newDirectMessage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}
