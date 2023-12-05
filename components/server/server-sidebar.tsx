"use client";

import useServer from "@/hooks/fetching/server/useServer";
import React, { useMemo } from "react";
import PuffLoader from "../loader/puff";
import MotionDivUp from "../animation/motion-div-up";
import { ChannelType, MemberRole } from "@prisma/client";
import { S_ServerWithRoleResponse } from "@/lib/types/api-response";
import ServerHeader from "./server-header";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerSearch from "./server-search";
import { Channel, Member } from "@prisma/client";
import { ScrollArea } from "../ui/scroll-area";

interface ServerSideBarProps {
  serverId: string;
}

const iconMap: Record<ChannelType, React.ReactNode> = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

const channelType = ["AUDIO", "TEXT", "VIDEO"];

export type objType = "member" | "channel";

const ServerSideBar: React.FC<ServerSideBarProps> = ({ serverId }) => {
  const {
    data: serverData,
    isLoading: serverLoading,
    isValidating,
  } = useServer({
    serverId: serverId,
  });
  const role = useMemo(() => {
    if (serverLoading || !serverData?.data) {
      return null;
    } else {
      return (serverData as S_ServerWithRoleResponse).data.role;
    }
  }, [serverLoading, isValidating, serverData]);
  const channelPerType = useMemo(() => {
    if (serverLoading || !serverData?.data) {
      return [];
    } else {
      const server = (serverData as S_ServerWithRoleResponse).data.server;
      const text: Channel[] = [];
      const audio: Channel[] = [];
      const video: Channel[] = [];
      if (server.channels.length == 0) {
        return [];
      }
      server.channels.map((ch) => {
        if (ch.type === "AUDIO") {
          audio.push(ch);
        } else if (ch.type == "TEXT") {
          text.push(ch);
        } else {
          video.push(ch);
        }
      });
      return [text, audio, video];
    }
  }, [serverLoading, serverData, isValidating]);
  const body: React.ReactElement = useMemo(() => {
    if (serverLoading || !serverData?.data) {
      return (
        <MotionDivUp key="loader">
          <PuffLoader height={60} width={60} />
        </MotionDivUp>
      );
    } else {
      const channelData = channelType.map((cT) => {
        const cPerType = channelPerType.find(
          (c) => c.length > 0 && c[0].type == cT
        );
        return {
          label: cT.charAt(0).toUpperCase() + cT.slice(1).toLowerCase(),
          type: "channel" as objType,
          data: !cPerType
            ? undefined
            : cPerType.map((ch) => ({
                name: ch.name,
                icon: iconMap[ch.type],
                id: ch.id,
              })),
        };
      });
      return (
        <MotionDivUp
          className="flex flex-col w-full h-full"
          key="server-header"
        >
          <ServerHeader
            role={role!}
            server={(serverData as S_ServerWithRoleResponse).data.server}
          />
          <ScrollArea className="flex-1">
            <ServerSearch data={channelData} />
          </ScrollArea>
        </MotionDivUp>
      );
    }
  }, [serverLoading, serverData, isValidating, channelPerType]);
  return (
    <div className="dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-full flex flex-col justify-center items-center">
      {body}
    </div>
  );
};

export default ServerSideBar;
