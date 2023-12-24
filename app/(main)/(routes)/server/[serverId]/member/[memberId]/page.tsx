"use client";

import ChatHeader from "@/components/chat/chat-header";
import ChatMessage from "@/components/chat/chat-message";
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
          <div className="flex-1" />
          <ChatHeader
            name={conversationData.data.otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
            imageUrl={conversationData.data.otherMember.profile.imageUrl}
          />
          <ChatMessage
            apiUrl={`/api/direct-message`}
            chatId={conversationData.data.conversation.id}
            member={conversationData.data.currentMember}
            name={conversationData.data.otherMember.profile.name}
            paramKey={"conversationId"}
            socketQuery={conversationData.data.conversation.id}
            socketUrl="/api/socket/direct-message"
            type="conversation"
            key={`${params.serverId}${params.memberId}`}
          />
        </div>
      );
    }
  }, [conversationData, conversationLoading]);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {body}
    </div>
  );
};

export default MemberPage;
