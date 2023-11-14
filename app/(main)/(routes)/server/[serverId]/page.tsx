import MotionDivUp from "@/components/animation/motion-div-up";
import prismadb from "@/lib/orm/prismadb";
import React from "react";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  console.log(server);
  return <MotionDivUp delay={0.5}>{server?.name}</MotionDivUp>;
};

export default ServerPage;
