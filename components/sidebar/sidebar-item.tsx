"use client";

import React from "react";
import { Prisma } from "@prisma/client";

interface SidebarItemProps {
  server: Prisma.ServerSelect;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ server }) => {
  return <div>{server.name}</div>;
};

export default SidebarItem;
