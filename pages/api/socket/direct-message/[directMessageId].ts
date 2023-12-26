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
    if (req.method !== "PATCH" && req.method !== "DELETE") {
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
    const { directMessageId } = req.query;
    const { content, fileUrl } = req.body;

    if (!content || !directMessageId) {
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
    let finalDirectMessage;

    if (req.method == "PATCH") {
      finalDirectMessage = await prismadb.directMessage.update({
        where: {
          id: directMessageId as string,
          memberId: currentMember.id,
        },
        data: {
          fileUrl: fileUrl as string,
          content: content as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else {
      finalDirectMessage = await prismadb.directMessage.update({
        where: {
          id: directMessageId as string,
          memberId: currentMember.id,
        },
        data: {
          deleted: true,
          content: "The message has been deleted",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `conversation:${finalDirectMessage.conversationId}:direct-message:update`;

    res.socket.server.io.emit(updateKey, finalDirectMessage);
    return res.status(200).json({
      success: true,
      message: "",
      data: finalDirectMessage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: (err as Error).message,
    });
  }
}
