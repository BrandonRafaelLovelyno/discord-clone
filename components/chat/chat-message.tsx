import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./chat-welcome";

interface ChatMessageProps {
  apiUrl: string;
  query: Record<string, string>;
  socketUrl: string;
  chatId: string;
  type: "conversation" | "channel";
  name: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  apiUrl,
  query,
  socketUrl,
  chatId,
  type,
  name,
}) => {
  return (
    <div className="flex flex-col w-full h-full py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
    </div>
  );
};

export default ChatMessage;
