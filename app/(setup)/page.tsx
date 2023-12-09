"use client";

import { redirect } from "next/navigation";
import ColorRingLoader from "@/components/loader/color-ring";
import { useMemo } from "react";
import useSetUp from "@/hooks/fetching/setup/useSetUp";
import InitialModal from "@/components/modal/initial-modal";
import { signIn } from "next-auth/react";
import MotionDivPage from "@/components/animation/motion-div-page";

export default function Home() {
  const { data: setUpData, isLoading: setUpLoading } = useSetUp();
  const body: React.ReactElement = useMemo(() => {
    if (setUpLoading) {
      return <ColorRingLoader width={200} height={200} />;
    } else {
      if (setUpData?.success) {
        if (setUpData.data) {
          return redirect(`/server/${setUpData.data.id}`);
        } else {
          return <InitialModal />;
        }
      } else {
        return <button onClick={() => signIn("google")}>logen</button>;
      }
    }
  }, [setUpLoading]);
  return (
    <MotionDivPage
      key={"set-up-screen"}
      className="flex flex-col items-center justify-center h-full"
    >
      {body}
    </MotionDivPage>
  );
}
