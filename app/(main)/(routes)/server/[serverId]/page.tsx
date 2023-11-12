import prismadb from "@/lib/orm/prismadb";
import React from "react";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  console.log(server);
  return <div>{server?.name}</div>;
};

export default ServerPage;
