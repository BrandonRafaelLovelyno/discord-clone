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
          <>
            <Image
              src={"/wallpaper.png"}
              alt="discord logo"
              fill
              objectFit="cover"
            />
            <div className="relative flex flex-col items-center justify-center gap-y-8">
              <div className="flex flex-row items-center justify-center gap-x-5">
                <Image
                  src={"/discord-logo.png"}
                  width={100}
                  height={100}
                  alt="discord"
                />
                <div className="flex flex-col gap-y-0">
                  <p className="text-5xl font-bold">Discord</p>
                  <p className="font-bold">Clone</p>
                </div>
              </div>
              <div
                className="relative flex flex-row items-center justify-between px-10 py-4 font-bold text-black bg-white rounded-lg cursor-pointer gap-x-10"
                onClick={() => signIn("google", {}, { prompt: "login" })}
              >
                <Image
                  src={"/google-logo.png"}
                  height={20}
                  width={20}
                  alt="google"
                />
                <p>Login with google account</p>
                <div />
              </div>
            </div>
          </>
        );
      }
    }
  }, [setUpLoading, setUpData]);
  return (
    <MotionDivPage
      key={"set-up-screen"}
      className="relative flex flex-col items-center justify-center h-full"
    >
      {body}
    </MotionDivPage>
  );
}
