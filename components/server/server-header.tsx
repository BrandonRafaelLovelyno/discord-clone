"use client";

import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { MemberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 text-md border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-5">
        {!isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400"
            onClick={() => modal.onOpen("invite", { server })}
          >
            Invite people <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400">
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400">
            Manage Members
            <Users className="w-4 h-4 ml-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400">
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400">
            Delete Server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-rose-400 dark:text-rose-600">
            Leave Server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
