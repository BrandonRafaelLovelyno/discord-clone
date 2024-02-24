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
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import ServerMember from "./server-member";
import { useSession } from "next-auth/react";

interface ServerSideBarProps {
  serverId: string;
}

const iconMap: Record<ChannelType, React.ReactNode> = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

export const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

const channelType = ["AUDIO", "TEXT", "VIDEO"];

export type objType = "member" | "channel";

const ServerSideBar: React.FC<ServerSideBarProps> = ({ serverId }) => {
  const { data: session, status: sessionStatus } = useSession();
  const {
    data: serverData,
    isLoading: serverLoading,
    isValidating,
  } = useServer({
    serverId: serverId,
  });
  const usedServer: ServerWithChannelWithMemberWithProfile | undefined =
    useMemo(() => {
      if (serverLoading || !serverData) {
        return undefined;
      }
      return (serverData as S_ServerWithRoleResponse).data.server;
    }, [serverData, serverLoading]);
  const role = useMemo(() => {
    if (serverLoading || !serverData?.data) {
      return null;
    } else {
      return (serverData as S_ServerWithRoleResponse).data.role;
    }
  }, [serverLoading, isValidating, serverData]);
  const channelPerType = useMemo(() => {
    if (serverLoading || !usedServer) {
      return [];
    } else {
      const server = usedServer;
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
  }, [serverLoading, serverData, usedServer]);
  const body: React.ReactElement = useMemo(() => {
    if (serverLoading || !usedServer || sessionStatus !== "authenticated") {
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
          label:
            cT.charAt(0).toUpperCase() + cT.slice(1).toLowerCase() + " channel",
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
      const memberData = {
        label: "Channel members",
        type: "member" as objType,
        data: usedServer.members.map((m) => ({
          icon: roleIconMap[m.role],
          name: m.profile.name,
          id: m.id,
        })),
      };
      return (
        <MotionDivUp
          className="flex flex-col w-full h-full"
          key="server-header"
        >
          <ServerHeader role={role!} server={usedServer} />
          <ScrollArea className="flex-1">
            <ServerSearch data={[...channelData, memberData]} />
            <Separator className="my-4 rounded-md bg-zinc-200 dark:bg-zinc-700" />
            {channelPerType.map((cT, index) => (
              <>
                <ServerSection
                  label={
                    index == 0
                      ? "text channel"
                      : index == 1
                      ? "audio channel"
                      : "video channel"
                  }
                  role={role!}
                  sectionType="channel"
                  server={usedServer}
                  key={"text-ch"}
                  channelType={
                    index == 0
                      ? ChannelType.TEXT
                      : index == 1
                      ? ChannelType.AUDIO
                      : ChannelType.VIDEO
                  }
                />
                {cT.map((ch) => (
                  <MotionDivUp
                    key={`${ch.id}${ch.type}`}
                    delay={Math.random()}
                    className="mb-1"
                  >
                    <ServerChannel
                      channel={ch}
                      role={role!}
                      server={usedServer}
                      icon={iconMap[ch.type]}
                    />
                  </MotionDivUp>
                ))}
              </>
            ))}
            <ServerSection
              label="Server Members"
              role={role!}
              sectionType="member"
              server={usedServer}
            />
            {usedServer.members.map((m) => {
              if (m.profileId != session.user.profileId) {
                return (
                  <MotionDivUp
                    delay={Math.random() + 1}
                    className="mb-2"
                    key={m.profileId}
                  >
                    <ServerMember member={m} server={usedServer} key={m.id} />
                  </MotionDivUp>
                );
              }
            })}
          </ScrollArea>
        </MotionDivUp>
      );
    }
  }, [serverLoading, channelPerType, role, session, sessionStatus, usedServer]);
  return (
    <div className="dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-full flex flex-col justify-center items-center">
      {body}
    </div>
  );
};

export default ServerSideBar;
