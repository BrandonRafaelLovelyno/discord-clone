import { Hash } from "lucide-react";
import React from "react";
import MobileToggle from "../mobile-toggle";

interface ChatHeaderProps {
  type: "channel" | "conversation";
  name: string;
  serverId: string;
  imageUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ type, name, serverId }) => {
  return (
    <div className="flex items-center h-12 pl-3 border-b-2 border-neutral-200 dark:border-neutral-800">
      <div className="md:hidden">
        <MobileToggle serverId={serverId} />
      </div>
      {type == "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      <p className="text-lg font-bold text-white lowercase">{name}</p>
    </div>
  );
};

export default ChatHeader;
