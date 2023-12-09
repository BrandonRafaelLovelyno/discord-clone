"use client";

import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { Member, Profile } from "@prisma/client";
import React, { useMemo } from "react";
import { roleIconMap } from "./server-sidebar";
import { twMerge } from "tailwind-merge";
import { useParams, useRouter } from "next/navigation";
import ProfileAvatar from "../profile-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: ServerWithChannelWithMemberWithProfile;
}

const ServerMember: React.FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams();
  const router = useRouter();
  const isMember = useMemo(() => {
    if (params.memberId !== member.id) {
      return false;
    }
    return true;
  }, [params]);
  const onClick = () => {
    router.push(`/server/${server.id}/member/${member.id}`);
  };
  return (
    <button
      className={twMerge(
        "w-full px-3 flex items-center gap-x-3 group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 duration-200",
        isMember && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={onClick}
    >
      <ProfileAvatar
        className="w-7 h-7 md:h-8 md:w-8"
        imageUrl={member.profile.imageUrl}
        key={member.id}
      />
      <p
        className={twMerge(
          "line-clamp-1 font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          isMember &&
            params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
};

export default ServerMember;
