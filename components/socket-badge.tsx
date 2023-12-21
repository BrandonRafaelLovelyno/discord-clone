"use client";

import React, { useMemo } from "react";
import { useSocket } from "./provider/socket-provider";
import { Badge } from "./ui/badge";

const SocketBadge = () => {
  const socket = useSocket();
  const className: string = useMemo(() => {
    return socket.isConnected
      ? "bg-emerald-600 text-white border-none"
      : "bg-yellow-600 text-white border-none";
  }, [socket.isConnected]);

  const text: string = useMemo(() => {
    return socket.isConnected
      ? "Live Real-time updates"
      : "Fallback : polling every 1s";
  }, [socket.isConnected]);
  return (
    <Badge className={className} variant="outline">
      {text}
    </Badge>
  );
};

export default SocketBadge;
