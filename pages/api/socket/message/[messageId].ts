import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { NextApiResponseServerIo } from "@/lib/types/socket";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(400).json({
      success: false,
      message: "Invalid method",
      data: {},
    });
  }
  try {
    const { content } = req.body;
    const { serverId, channelId, messageId } = req.query;

    if (!serverId || !channelId || !messageId) {
      return res.status(400).json({
        success: false,
        message: "Missing queries",
        data: {},
      });
    }

    if (req.method === "PATCH" && !content) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
        data: {},
      });
    }

    const session = await getServerSession(req, res, options);
    if (!session) {
      return res.status(402).json({
        success: false,
        message: "Unautorized",
        data: {},
      });
    }
    const server = await prismadb.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: session.user.profileId,
          },
        },
        channels: {
          some: {
            id: channelId as string,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(400).json({
        success: false,
        message: "Invalid serverId or channelId",
        data: {},
      });
    }
    const currentMember = server.members.find(
      (m) => m.profileId == session.user.profileId
    );

    if (!currentMember) {
      return res.status(400).json({
        success: false,
        message: "Invalid memberId",
        data: {},
      });
    }

    const message = await prismadb.message.findUnique({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: true,
      },
    });

    if (!message || message.deleted) {
      return res.status(400).json({
        success: false,
        message: "Invalid messageId",
        data: {},
      });
    }

    const isOwner = currentMember.profileId == message.member.profileId;
    const isAdmin = currentMember.role == MemberRole.ADMIN;
    const isModerator = currentMember.role == MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(402).json({
        success: false,
        message: "Unauthorized",
        data: {},
      });
    }

    let finalMessage;

    if (req.method == "PATCH") {
      finalMessage = await prismadb.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
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
      finalMessage = await prismadb.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: "This message has been deleted",
          deleted: true,
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

    const updateKey = `chat:${channelId}:message:update`;

    res.socket.server.io.emit(updateKey, finalMessage);

    return res.status(200).json({
      success: true,
      message: "",
      data: finalMessage,
    });
  } catch (err) {
    console.log((err as Error).message);
    return res.status(500).json({
      success: false,
      message: (err as Error).message,
      data: {},
    });
  }
}
