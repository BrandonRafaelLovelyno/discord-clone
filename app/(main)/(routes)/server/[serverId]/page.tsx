import options from "@/lib/auth/option";
import prismadb from "@/lib/orm/prismadb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const session = await getServerSession(options);
  if (!session) {
    return redirect("/");
  }
  const server = await prismadb.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: session.user.profileId,
        },
      },
    },
    include: {
      channels: true,
    },
  });
  if (!server) {
    return redirect("/");
  }
  return redirect(
    `/server/${params.serverId}/channel/${server.channels[0].id}`
  );
};

export default ServerPage;
