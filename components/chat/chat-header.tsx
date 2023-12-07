import React from "react";

interface ChatHeaderProps {
  type: "channel" | "member";
  name: string;
  serverId: string;
  imageUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ type, name }) => {
  return (
    <div className="h-12 border-b-2 border-neutral-200 dark:border-neutral-800">
      {name}
    </div>
  );
};

export default ChatHeader;
