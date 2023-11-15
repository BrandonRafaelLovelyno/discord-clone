import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  console.log("on server sir");
  const session = await getServerSession(options);
  if (!session) {
    return redirect("/");
  }
  const joinedServer = await prismadb.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: session.user.profileId,
        },
      },
    },
  });
  if (joinedServer) {
    return redirect(
      `/server/${joinedServer.id}?profileId=${session.user.profileId}`
    );
  }
  const server = await prismadb.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });
  if (server) {
    const updatedServer = await prismadb.server.update({
      where: {
        inviteCode: params.inviteCode,
      },
      data: {
        members: {
          create: {
            profileId: session.user.profileId,
          },
        },
      },
    });
    return redirect(`/server/${server.id}?profileId=${session.user.profileId}`);
  }
  return redirect("/");
};

export default InvitePage;
