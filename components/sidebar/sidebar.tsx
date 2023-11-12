"use client";

import useServer from "@/hooks/server/useServer";
import { toast } from "react-hot-toast";
import React, { useEffect, useMemo } from "react";
import MotionDivPage from "../animation/motion-div-page";
import SidebarAction from "./sidebar-action";
import { M_ServerResponse } from "@/lib/types/api response/server-response";
import SidebarItem from "./sidebar-item";

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
    <MotionDivPage className="flex flex-col items-center w-full h-full px-3 py-5">
      <SidebarAction />
      {(serverData as M_ServerResponse).data.map((s) => (
        <SidebarItem server={s} />
      ))}
    </MotionDivPage>
  );
};

export default Sidebar;
