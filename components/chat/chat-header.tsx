import { Hash } from "lucide-react";
import React from "react";
import MobileToggle from "../mobile-toggle";
import MotionDivDown from "../animation/motion-div-down";
import ProfileAvatar from "../profile-avatar";
import ConnectivityBadge from "../connectivity-badge";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
  type: "channel" | "conversation";
  name: string;
  serverId: string;
  imageUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  type,
  name,
  serverId,
  imageUrl,
}) => {
  return (
    <MotionDivDown className="flex items-center h-12 px-3 border-b-2 gap-x-2 border-neutral-200 dark:border-neutral-800">
      <div className="md:hidden">
        <MobileToggle serverId={serverId} />
      </div>
      {type == "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type == "conversation" && imageUrl && (
        <ProfileAvatar imageUrl={imageUrl!} className="w-8 h-8 md:w-8 md:h-8" />
      )}
      <p className="text-lg font-bold text-white lowercase">{name}</p>
      <div className="ml-auto">
        <div className="flex items-center gap-x-3">
          {type == "conversation" && <ChatVideoButton />}

          <ConnectivityBadge />
        </div>
      </div>
    </MotionDivDown>
  );
};

export default ChatHeader;
