"use client";

import React from "react";
import { useSocket } from "./provider/socket-provider";
import { Badge } from "./ui/badge";

const SocketBadge = () => {
  const socket = useSocket();
  const className: string = socket.isConnected
    ? "bg-yellow-600 text-white border-none"
    : "bg-emerald-600 text-white border-none";
  const text: string = socket.isConnected
    ? "Fallback : polling every 1s"
    : "Live Real-time updates";

  return (
    <Badge className={className} variant="outline">
      {text}
    </Badge>
  );
};

export default SocketBadge;
