"use client";

import useServer from "@/hooks/fetching/server/useServer";
import React, { useMemo } from "react";
import PuffLoader from "../loader/puff";
import MotionDivUp from "../animation/motion-div-up";
import { Channel } from "@prisma/client";
import { S_ServerWithRoleResponse } from "@/lib/types/api-response";
import ServerHeader from "./server-header";

interface ServerSideBarProps {
  serverId: string;
}

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
  }, [serverLoading]);
  const body: React.ReactElement = useMemo(() => {
    if (serverLoading || !serverData?.data) {
      return (
        <MotionDivUp key="loader">
          <PuffLoader height={60} width={60} />
        </MotionDivUp>
      );
    } else {
      return (
        <MotionDivUp className="w-full h-full" key="server header">
          <ServerHeader
            role={role!}
            server={(serverData as S_ServerWithRoleResponse).data.server}
          />
        </MotionDivUp>
      );
    }
  }, [serverLoading, serverData, isValidating]);
  const [textChannel, audioChannel, videoChannel] = useMemo(() => {
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
  }, [serverLoading]);
  return (
    <div className="dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-full flex flex-col justify-center items-center">
      {body}
    </div>
  );
};

export default ServerSideBar;
