"use client";

import { Channel, MemberRole } from "@prisma/client";
import { Server } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import ActionTooltip from "../action-tooltip";
import { Edit, Lock, Trash } from "lucide-react";
import useModal from "@/hooks/useModal";

interface ServerChannelProps {
  server: Server;
  role: MemberRole;
  channel: Channel;
  icon: React.ReactNode;
}

const ServerChannel: React.FC<ServerChannelProps> = ({
  server,
  role,
  channel,
  icon,
}) => {
  const modal = useModal();
  const params = useParams();
  const isChannel = useMemo(() => {
    if (params.serverId == channel.id) {
      return true;
    }
    return false;
  }, [params]);
  return (
    <button
      className={twMerge(
        "w-full py-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 px-3 group duration-150 flex",
        isChannel && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {icon}
      <p
        className={twMerge(
          "text-sm font-semibold text-left lowercase line-clamp-1 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 duration-200",
          isChannel &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "General" && role !== MemberRole.GUEST && (
        <div className="hidden ml-auto group-hover:flex gap-x-2">
          <ActionTooltip align="center" side="top" label="Edit">
            <Edit
              className="w-4 h-4 text-zinc-400"
              onClick={() => modal.onOpen("editChannel", { channel })}
            />
          </ActionTooltip>
          <ActionTooltip align="center" side="top" label="Delete">
            <Trash
              className="w-4 h-4 text-zinc-400"
              onClick={() => modal.onOpen("deleteChannel", { channel })}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name == "General" && (
        <Lock className="w-4 h-4 ml-auto text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
