"use client";
import MotionDivUp from "@/components/animation/motion-div-up";
import ServerSideBar from "@/components/server/server-sidebar";

interface ServerLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerLayout: React.FC<ServerLayoutProps> = ({ children, params }) => {
  return (
    <div className="flex w-full h-full">
      <div className="w-64 h-full max-md:hidden">
        <MotionDivUp key="server sidebar" className="w-full h-full">
          <ServerSideBar serverId={params.serverId} />
        </MotionDivUp>
      </div>
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
};

export default ServerLayout;
