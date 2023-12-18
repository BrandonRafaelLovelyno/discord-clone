import { MemberWithProfile } from "@/lib/types/collection";
import { Member } from "@prisma/client";
import React from "react";

interface ChatItemProps {
  id: string;
  currentMember: Member;
  content: string;
  timeStamp: string;
  isUpdated: boolean;
  isDeleted: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
  fileUrl: string | null;
  member: MemberWithProfile;
}

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  currentMember,
  content,
  timeStamp,
  isUpdated,
  isDeleted,
  socketQuery,
  socketUrl,
  fileUrl,
  member,
}) => {
  return <div className="flex p-4">{timeStamp}</div>;
};

export default ChatItem;
