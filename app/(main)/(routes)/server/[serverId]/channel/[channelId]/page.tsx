"use client";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-message";
import ThreeCircleLoader from "@/components/loader/three-circle";
import useChannel from "@/hooks/fetching/channel/useChannel";
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
          <div className="flex-1 overflow-y-auto">
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
        </div>
      );
    }
  }, [channelData, channelLoading]);
  return <>{body}</>;
};

export default ChannelPage;
