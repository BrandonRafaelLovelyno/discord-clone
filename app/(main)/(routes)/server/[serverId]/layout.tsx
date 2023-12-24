"use client";
import MotionDivUp from "@/components/animation/motion-div-up";
import ServerSideBar from "@/components/server/server-sidebar";
import useServer from "@/hooks/fetching/server/useServer";
import { S_ServerWithRoleResponse } from "@/lib/types/api-response";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface ServerLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerLayout: React.FC<ServerLayoutProps> = ({ children, params }) => {
  const { data: serverData, isLoading: serverLoading } = useServer({
    serverId: params.serverId,
  });
  useEffect(() => {
    if (serverLoading || !serverData) {
      return;
    }
    if (!(serverData as S_ServerWithRoleResponse).success) {
      return redirect("/");
    }
  }, [serverData, serverLoading]);
  return (
    <div className="flex w-full h-full bg-white dark:bg-[#313338]">
      <MotionDivUp key="server-sidebar" className="w-64 h-full max-md:hidden">
        <ServerSideBar serverId={params.serverId} />
      </MotionDivUp>
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
};

export default ServerLayout;
