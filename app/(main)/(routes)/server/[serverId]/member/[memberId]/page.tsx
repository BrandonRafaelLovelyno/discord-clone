"use client";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-message";
import ThreeCircleLoader from "@/components/loader/three-circle";
import useConversation from "@/hooks/fetching/conversation/useConversation";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MediaRoom from "@/components/media-room";
import MotionDivUp from "@/components/animation/motion-div-up";

interface MemberPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberPage: React.FC<MemberPageProps> = ({ params }) => {
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");
  const { data: conversationData, isLoading: conversationLoading } =
    useConversation(params.memberId, params.serverId);
  const body: React.ReactNode = useMemo(() => {
    if (conversationLoading || !conversationData) {
      return <ThreeCircleLoader size={100} />;
    } else {
      if (!isVideo) {
        return (
          <div className="flex flex-col w-full h-full">
            <ChatHeader
              name={conversationData.data.otherMember.profile.name}
              serverId={params.serverId}
              type="conversation"
              imageUrl={conversationData.data.otherMember.profile.imageUrl}
            />
            <MotionDivUp
              key={`${params.memberId} chat`}
              className="flex-1 overflow-hidden"
            >
              <div className="w-full h-full">
                <ChatMessage
                  apiUrl={`/api/direct-message`}
                  chatId={conversationData.data.conversation.id}
                  member={conversationData.data.currentMember}
                  name={conversationData.data.otherMember.profile.name}
                  paramKey={"conversationId"}
                  socketQuery={{
                    conversationId: conversationData.data.conversation.id,
                  }}
                  socketUrl="/api/socket/direct-message"
                  type="conversation"
                  key={`${params.serverId}${params.memberId}`}
                />
              </div>
              <ChatInput
                apiUrl={`/api/socket/direct-message`}
                name={conversationData.data.otherMember.profile.name}
                query={{
                  conversationId: conversationData.data.conversation.id,
                }}
                type="conversation"
              />
            </MotionDivUp>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col w-full h-full">
            <ChatHeader
              name={conversationData.data.otherMember.profile.name}
              serverId={params.serverId}
              type="conversation"
              imageUrl={conversationData.data.otherMember.profile.imageUrl}
            />
            <MediaRoom
              audio={false}
              chatId={conversationData.data.conversation.id}
              username={conversationData.data.otherMember.profile.name}
              video
            />
          </div>
        );
      }
    }
  }, [conversationData, conversationLoading, isVideo]);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {body}
    </div>
  );
};

export default MemberPage;
