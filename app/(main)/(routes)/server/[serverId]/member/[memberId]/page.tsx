"use client";

import ChatHeader from "@/components/chat/chat-header";
import ThreeCircleLoader from "@/components/loader/three-circle";
import useConversation from "@/hooks/fetching/conversation/useConversation";
import React, { useMemo } from "react";

interface MemberPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberPage: React.FC<MemberPageProps> = ({ params }) => {
  const { data: conversationData, isLoading: conversationLoading } =
    useConversation(params.memberId, params.serverId);
  const body: React.ReactNode = useMemo(() => {
    if (conversationLoading || !conversationData) {
      return <ThreeCircleLoader size={100} />;
    } else {
      return (
        <div className="flex flex-col w-full h-full">
          <ChatHeader
            name={conversationData.data.otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
            imageUrl={conversationData.data.otherMember.profile.imageUrl}
          />
        </div>
      );
    }
  }, [conversationData, conversationLoading]);
  return <div className="w-full h-full">{body}</div>;
};

export default MemberPage;
