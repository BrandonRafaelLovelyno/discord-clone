"use client";

import MotionDivPage from "@/components/animation/motion-div-page";
import NavigationBar from "@/components/navigation/navigation-bar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status: sessionStatus } = useSession();
  const navbar: React.ReactElement = useMemo(() => {
    if (sessionStatus !== "authenticated") {
      return <></>;
    } else {
      return <NavigationBar />;
    }
  }, [sessionStatus]);
  if (sessionStatus == "unauthenticated") {
    return redirect("/");
  }

  return (
    <MotionDivPage className="flex flex-row w-full h-full" key={"main-page"}>
      <div className="max-md:hidden h-full w-[75px] dark:bg-[#1E1F22] bg-[#E3E5E8]">
        {navbar}
      </div>
      {children}
    </MotionDivPage>
  );
}
