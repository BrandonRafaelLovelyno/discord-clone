import { Hash } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  name: string;
  type: "conversation" | "channel";
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ name, type }) => {
  return (
    <div className="px-4 mb-4 space-y-2">
      {type == "channel" && (
        <div className="h-[75px] w-[75px] rounded-full flex justify-center items-center bg-zinc-500 dark:bg-zinc-700">
          <Hash className="w-12 h-12 text-white" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type == "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-md text-zinc-300 dark:text-zinc-500">
        This is the start of{" "}
        {type == "channel"
          ? `the #${name} chat`
          : `your conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
