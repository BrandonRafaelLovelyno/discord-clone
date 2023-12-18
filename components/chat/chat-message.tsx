"use client";

import { format } from "date-fns";
import { Member } from "@prisma/client";
import React, { Fragment } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { MessageWithMemberWithProfile } from "@/lib/types/collection";
import ChatItem from "./chat-item";

interface ChatMessageProps {
  apiUrl: string;
  socketUrl: string;
  chatId: string;
  type: "conversation" | "channel";
  name: string;
  paramKey: "channelId" | "conversationId";
  socketQuery: { serverId: string; channelId: string };
  member: Member;
}

const DATE_FORMAT = "d MM yyyy, HH:mm";

const ChatMessage: React.FC<ChatMessageProps> = ({
  apiUrl,
  paramKey,
  socketQuery,
  socketUrl,
  chatId,
  type,
  member,
  name,
}) => {
  const queryKey = `chat:${chatId}`;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    apiUrl,
    paramKey,
    paramValue: chatId,
    queryKey,
  });

  if (status == "pending") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error" || !data || !data.pages) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
      {data.pages.map(
        (
          group: { data: { messages: MessageWithMemberWithProfile[] } },
          index
        ) => {
          if (!group.data) return <></>;
          return (
            <Fragment key={index}>
              {group.data.messages.map((msg) => (
                <ChatItem
                  content={msg.content}
                  currentMember={member}
                  fileUrl={msg.fileUrl}
                  id={msg.id}
                  isDeleted={msg.deleted}
                  isUpdated={msg.updatedAt !== msg.createdAt}
                  member={msg.member}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                  timeStamp={format(new Date(msg.createdAt), DATE_FORMAT)}
                  key={msg.id}
                />
              ))}
            </Fragment>
          );
        }
      )}
    </div>
  );
};

export default ChatMessage;
