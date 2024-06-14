"use client";

import React, { useMemo } from "react";
import { useSocket } from "./provider/socket-provider";
import { Badge } from "./ui/badge";

const SocketBadge = () => {
  const { isConnected } = useSocket();
  const className = isConnected
    ? "text-white border-none bg-emerald-600"
    : "text-white border-none bg-rose-600";

  const text: string = isConnected
    ? "Connected to socket"
    : "Disconnected from socket";

  return (
    <Badge className={className} variant="outline">
      {text}
    </Badge>
  );
};

export default SocketBadge;
