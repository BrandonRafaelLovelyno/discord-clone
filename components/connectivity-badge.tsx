"use client";

import React from "react";
import { Badge } from "./ui/badge";

const ConnectivityBadge = () => {
  const className = "text-white border-none bg-emerald-600";

  const text: string = "Real-time fetching";

  return (
    <Badge className={className} variant="outline">
      {text}
    </Badge>
  );
};

export default ConnectivityBadge;
