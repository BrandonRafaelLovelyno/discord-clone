"use client";

import { io as ClientIO, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

interface SocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<SocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
      addTrailingSlash: false,
      path: "/api/socket/io",
    });
    setSocket(newSocket);

    newSocket.on("connected", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnected", () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
