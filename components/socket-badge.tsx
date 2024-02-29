"use client";

import React, { useMemo } from "react";
import { useSocket } from "./provider/socket-provider";
import { Badge } from "./ui/badge";

const SocketBadge = () => {
  const socket = useSocket();
  const className = "text-white border-none bg-emerald-600";

  const text: string = "Live Real-time updates";

  return (
    <Badge className={className} variant="outline">
      {text}
    </Badge>
  );
};

export default SocketBadge;
