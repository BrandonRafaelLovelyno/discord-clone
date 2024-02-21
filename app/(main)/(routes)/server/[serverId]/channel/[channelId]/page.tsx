"use client";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-message";
import ThreeCircleLoader from "@/components/loader/three-circle";
import MediaRoom from "@/components/media-room";
import useChannel from "@/hooks/fetching/channel/useChannel";
import { ChannelType } from "@prisma/client";
import React, { useMemo } from "react";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  const { data: channelData, isLoading: channelLoading } = useChannel(
    params.channelId,
    params.serverId
  );
  const body: React.ReactNode = useMemo(() => {
    if (!channelData || channelLoading || !channelData.success) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <ThreeCircleLoader size={100} />
        </div>
      );
    } else {
      const channelName: string = channelData.data.channel.name.toLowerCase();
      return (
        <div className="flex flex-col w-full h-full">
          <ChatHeader
            name={channelName}
            serverId={params.serverId}
            type="channel"
            imageUrl=""
          />
          {channelData.data.channel.type == ChannelType.TEXT && (
            <>
              <div className="flex-1 overflow-hidden">
                <ChatMessage
                  paramKey="channelId"
                  apiUrl="/api/message"
                  chatId={params.channelId}
                  socketQuery={{
                    channelId: params.channelId,
                    serverId: params.serverId,
                  }}
                  member={channelData.data.currentMember}
                  socketUrl="/api/socket/message"
                  type="channel"
                  name={channelName}
                />
              </div>
              <div>
                <ChatInput
                  apiUrl="/api/socket/message"
                  type="channel"
                  name={channelName.toLowerCase()}
                  query={{
                    serverId: params.serverId,
                    channelId: params.channelId,
                  }}
                />
              </div>
            </>
          )}
          {channelData.data.channel.type == ChannelType.AUDIO && (
            <div className="flex-1">
              <MediaRoom
                username={channelData.data.currentMember.profile.name}
                audio={true}
                chatId={channelData.data.channel.id}
                video={false}
              />
            </div>
          )}
          {channelData.data.channel.type == ChannelType.VIDEO && (
            <div className="flex-1">
              <MediaRoom
                username={channelData.data.currentMember.profile.name}
                audio={false}
                chatId={channelData.data.channel.id}
                video={true}
              />
            </div>
          )}
        </div>
      );
    }
  }, [channelData, channelLoading, params]);
  return <>{body}</>;
};

export default ChannelPage;
