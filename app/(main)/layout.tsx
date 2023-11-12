"use client";

import MotionDivPage from "@/components/animation/motion-div-page";
import Sidebar from "@/components/sidebar/sidebar";
import options from "@/lib/auth/option";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status: sessionStatus, update } = useSession();
  const body: React.ReactElement = useMemo(() => {
    if (sessionStatus !== "authenticated") {
      return <></>;
    } else {
      return <Sidebar profileId={session.user.profileId} />;
    }
  }, [sessionStatus]);
  if (sessionStatus == "unauthenticated") {
    return redirect("/");
  }

  if (sessionStatus == "loading") {
    return;
  }

  return (
    <MotionDivPage className="flex flex-row w-full h-full">
      <div className="max-md:hidden h-full w-[75px] dark:bg-[#1E1F22] bg-[#E3E5E8]">
        {body}
      </div>
      {children}
    </MotionDivPage>
  );
}
