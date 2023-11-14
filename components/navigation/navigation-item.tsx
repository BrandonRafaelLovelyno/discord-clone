"use client";

import React from "react";
import { Server } from "@prisma/client";
import Image from "next/image";
import ActionTooltip from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  server: Server;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ server }) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/server/${server.id}`);
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
            "h-[10px] group-hover:bg-gray-300 bg-gray-500 group-hover:h-[30px]"
        )}
      />
      <ActionTooltip
        align="center"
        side="right"
        label={server.name}
        className="w-[50px] h-[50px] relative rounded-full overflow-hidden"
      >
        <button className="w-full h-full">
          <Image fill alt={`${server.name} image`} src={server.imageUrl} />
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationItem;
