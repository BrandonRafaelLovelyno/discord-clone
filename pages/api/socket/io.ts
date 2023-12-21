import { NextApiResponseServerIo } from "@/lib/types/socket";
import { NextApiRequest } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIoServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  console.log("[[IO ROUTE HIT]]");
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIoServer(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
    console.log("the io");
    console.log(io);
  }
  res.end();
};

export default ioHandler;
