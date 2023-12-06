"use client";

import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { objType } from "./server-sidebar";
import { Plus } from "lucide-react";
import useModal from "@/hooks/useModal";
import ActionTooltip from "../action-tooltip";

interface ServerSectionProps {
  role: MemberRole;
  server: ServerWithChannelWithMemberWithProfile;
  sectionType: objType;
  channelType: ChannelType;
  label: string;
}

const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  role,
  server,
  sectionType,
  channelType,
}) => {
  const modal = useModal();
  return (
    <div className="w-full px-3 mt-3">
      <div className="flex justify-between w-full">
        <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
        {role !== MemberRole.GUEST && sectionType == "channel" && (
          <ActionTooltip label="Create server" align="center" side="right">
            <button
              className="text-gray-500 duration-200 hover:text-gray-300"
              onClick={() => modal.onOpen("createChannel", { server })}
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      </div>
    </div>
  );
};

export default ServerSection;
