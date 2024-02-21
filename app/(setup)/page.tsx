"use client";

import { redirect } from "next/navigation";
import ColorRingLoader from "@/components/loader/color-ring";
import { useMemo } from "react";
import useSetUp from "@/hooks/fetching/setup/useSetUp";
import InitialModal from "@/components/modal/initial-modal";
import { signIn } from "next-auth/react";
import MotionDivPage from "@/components/animation/motion-div-page";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

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
        return (
          <div className="flex flex-col items-center justify-center gap-y-8">
            <Image
              src={"/discord-logo.png"}
              width={200}
              height={200}
              alt="discord logo"
            />
            <div
              className="relative flex flex-row items-center justify-between px-10 py-4 font-bold text-white bg-purple-900 rounded-lg cursor-pointer gap-x-10 bg-opacity-40"
              onClick={() => signIn("google", {}, { prompt: "login" })}
            >
              <FaGoogle size={20} />
              <p>Login with google account</p>
              <div />
            </div>
          </div>
        );
      }
    }
  }, [setUpLoading, setUpData]);
  return (
    <MotionDivPage
      key={"set-up-screen"}
      className="flex flex-col items-center justify-center h-full"
    >
      {body}
    </MotionDivPage>
  );
}
