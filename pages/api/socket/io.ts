import { NextApiResponseServerIo } from "@/lib/types/socket";
import { Server as NetServer } from "net";
import { NextApiRequest } from "next";
import { Server as SocketIoServer } from "socket.io";

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server;
    const io = new SocketIoServer({
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
