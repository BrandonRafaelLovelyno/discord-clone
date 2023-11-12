"use client";

import React from "react";
import { Server } from "@prisma/client";
import Image from "next/image";
import ActionTooltip from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  server: Server;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ server }) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`server/${server.id}`);
  };
  return (
    <div
      className="flex items-center w-full h-fit group gap-x-2"
      onClick={onClick}
    >
      <div
        className={cn(
          "transition-all duration-150 w-[6px] rounded-t-lg rounded-b-lg",
          params?.serverId == server.id && "h-[50px] bg-white",
          params?.serverId != server.id &&
            "h-[10px] group-hover:bg-white bg-gray-500"
        )}
      />
      <ActionTooltip
        align="center"
        side="right"
        label={server.name}
        className="w-[50px] h-[50px] relative rounded-2xl overflow-hidden"
      >
        <button className="w-full h-full">
          <Image fill alt={`${server.name} image`} src={server.imageUrl} />
        </button>
      </ActionTooltip>
    </div>
  );
};

export default SidebarItem;
