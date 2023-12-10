"use client";

import ChatHeader from "@/components/chat/chat-header";
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
      return (
        <div className="flex flex-col w-full h-full">
          <ChatHeader
            name={channelData.data.name}
            serverId={params.serverId}
            type="channel"
            imageUrl=""
          />
        </div>
      );
    }
  }, [channelData, channelLoading]);
  return <>{body}</>;
};

export default ChannelPage;
