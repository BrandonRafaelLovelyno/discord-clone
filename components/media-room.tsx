"use client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
interface MediaRoomProps {
  video: boolean;
  audio: boolean;
  username: string;
  chatId: string;
}

const MediaRoom: React.FC<MediaRoomProps> = ({
  video,
  audio,
  chatId,
  username,
}) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${chatId}&username=${username}`
        );
        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [token, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
