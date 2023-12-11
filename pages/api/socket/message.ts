import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { NextApiResponseServerIo } from "@/lib/types/socket";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

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
    const { serverId, channelId } = req.query;
    const { content, fileUrl } = req.body;

    if (!content || !channelId || !serverId) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
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
        content: content as string,
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
      message: (err as Error).message,
    });
  }
}
