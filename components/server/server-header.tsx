"use client";

import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { MemberRole } from "@prisma/client";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import useModal from "@/hooks/useModal";

interface ServerHeaderProps {
  server: ServerWithChannelWithMemberWithProfile;
  role: MemberRole;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const isModerator = role == "MODERATOR";
  const isAdmin = role == "ADMIN";
  const modal = useModal();
  const usedServer = modal.data?.server || server;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 text-md border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
          {usedServer.name}
          <ChevronDown className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-5">
        {!isModerator && (
          <DropdownMenuItem
            className="flex px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400 gap-x-3"
            onClick={() => modal.onOpen("invite", { server: usedServer })}
          >
            Invite people <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="flex px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400 gap-x-3"
            onClick={() => {
              modal.onOpen("editServer", { server: usedServer });
            }}
          >
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="flex px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400 gap-x-3"
            onClick={() => modal.onOpen("members", { server: usedServer })}
          >
            Manage Members
            <Users className="w-4 h-4 ml-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="flex px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400 gap-x-3"
            onClick={() =>
              modal.onOpen("createChannel", { server: usedServer })
            }
          >
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="flex px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400 gap-x-3">
            Delete Server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="flex px-3 py-2 text-sm cursor-pointer text-rose-400 dark:text-rose-600 gap-x-3">
            Leave Server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
