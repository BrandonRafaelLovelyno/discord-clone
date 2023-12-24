"use client";

import { format } from "date-fns";
import { Member } from "@prisma/client";
import React, { ElementRef, Fragment, useRef } from "react";
import ChatWelcome from "./chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { MessageWithMemberWithProfile } from "@/lib/types/collection";
import ChatItem from "./chat-item";
import useChatSocket from "@/hooks/use-chat-socket";
import useChatScroll from "@/hooks/use-chat-scroll";

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
  const queryKey = `channel:${chatId}`;
  const addKey = `channel:${chatId}:message`;
  const updateKey = `channel:${chatId}:message:update`;
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

  useChatSocket({ addKey, updateKey, queryKey });

  const topRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useChatScroll({
    hasNextPage,
    topRef,
    bottomRef,
    loadMore: fetchNextPage,
    count: data?.pages[0].data.messages.length ?? 0,
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
    <div
      className="flex flex-col w-full h-full py-4 overflow-y-auto"
      ref={topRef}
    >
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
      <div className="flex flex-col-reverse">
        {data.pages.map(
          (
            page: { data: { messages: MessageWithMemberWithProfile[] } },
            index
          ) => {
            if (!page.data) return <></>;
            return (
              <Fragment key={index}>
                {page.data.messages.map((msg) => (
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
                    key={`${msg.id} ${msg.updatedAt}`}
                  />
                ))}
              </Fragment>
            );
          }
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessage;
