"use client";

import useServer from "@/hooks/fetching/server/useServer";
import React from "react";
import MotionDivPage from "../animation/motion-div-page";
import SidebarAction from "./sidebar-action";
import { M_ServerResponse } from "@/lib/types/api response/server-response";
import SidebarItem from "./sidebar-item";
import ActionTooltip from "../action-tooltip";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ThemeToggler } from "../theme-toggler";

interface SidebarProps {
  profileId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ profileId }) => {
  const {
    data: serverData,
    isLoading: serverLoading,
    mutate,
  } = useServer({ profileId });
  if (serverLoading || !serverData?.data) {
    return <></>;
  }
  return (
    <MotionDivPage className="flex flex-col items-center w-full h-full px-2 py-5 gap-y-5 ">
      <ActionTooltip label="Create server" align="center" side="right">
        <SidebarAction />
      </ActionTooltip>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex flex-col items-center h-full">
        <div className="flex-1">
          {(serverData as M_ServerResponse).data.map((s) => (
            <SidebarItem server={s} key={s.id} />
          ))}
        </div>
        <div className="justify-end">
          <ThemeToggler />
        </div>
      </ScrollArea>
    </MotionDivPage>
  );
};

export default Sidebar;
