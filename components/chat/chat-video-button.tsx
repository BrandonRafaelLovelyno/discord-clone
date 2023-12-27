"use client";

import React from "react";

import qs from "query-string";
import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const ChatVideoButton = () => {
  const searchParam = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const isVideo = searchParam?.get("video");
  const Icon: React.ReactElement = isVideo ? (
    <VideoOff className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
  ) : (
    <Video className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
  );
  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathName || "",
      query: {
        video: isVideo ? undefined : true,
      },
    });
    router.push(url);
  };
  return (
    <ActionTooltip
      align={"center"}
      side="bottom"
      label={!isVideo ? "Start video" : "End video"}
    >
      <button onClick={onClick} className="flex items-center">
        {Icon}
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
