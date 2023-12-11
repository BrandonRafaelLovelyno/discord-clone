import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { NextApiResponseServerIo } from "@/lib/types/socket";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return res
        .status(402)
        .json({ success: false, message: "Unauthorized", data: {} });
    }
    const { serverId, channelId } = req.query;
    const { chat, fileUrl } = req.body;

    const server = await prismadb.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: session.user.profileId,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res
        .status(402)
        .json({ success: false, message: "Invalid serverId", data: {} });
    }
    const channel = await prismadb.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res
        .status(402)
        .json({ success: false, message: "Invalid channelId", data: {} });
    }
    const member = server.members.find(
      (m) => m.profileId == session.user.profileId
    );
    if (!member) {
      return res
        .status(402)
        .json({ success: false, message: "Unauthorized member", data: {} });
    }
    const message = await prismadb.message.create({
      data: {
        fileUrl: fileUrl as string,
        content: chat as string,
        memberId: member.id,
        channelId: channelId as string,
      },
    });
    const socketKey = `channel:${channelId}:message`;
    res.socket.server.io.emit(socketKey, message);
    return res.status(200).json({
      success: true,
      message: "",
      data: message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: {},
      message: "Internal server error",
    });
  }
}
