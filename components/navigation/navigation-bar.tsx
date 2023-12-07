"use client";

import useServer from "@/hooks/fetching/server/useServer";
import React from "react";
import NavigationAction from "./navigation-action";
import { M_ServerResponse } from "@/lib/types/api-response";
import NavigationItem from "./navigation-item";
import ActionTooltip from "../action-tooltip";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ThemeToggler } from "../theme-toggler";
import MotionDivUp from "../animation/motion-div-up";

const NavigationBar: React.FC = () => {
  const { data: serverData, isLoading: serverLoading } = useServer({});
  if (serverLoading || !serverData?.data) {
    return <></>;
  }
  return (
    <MotionDivUp
      className="flex flex-col items-center w-full h-full px-2 py-5 gap-y-5 "
      key="server sidebar"
    >
      <ActionTooltip label="Create server" align="center" side="right">
        <NavigationAction />
      </ActionTooltip>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex flex-col items-center h-full">
        <div className="flex flex-col flex-1 gap-y-4">
          {(serverData as M_ServerResponse).data.map((s) => (
            <NavigationItem server={s} key={s.id} />
          ))}
        </div>
        <div className="justify-end">
          <ThemeToggler />
        </div>
      </ScrollArea>
    </MotionDivUp>
  );
};

export default NavigationBar;
