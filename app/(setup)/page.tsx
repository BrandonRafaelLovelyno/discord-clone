"use client";

import { redirect } from "next/navigation";
import Loader from "@/components/loader/loader";
import { useMemo } from "react";
import useSetUp from "@/hooks/fetching/setup/useSetUp";
import InitialModal from "@/components/modal/initial-modal";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: setUpData, isLoading: setUpLoading, mutate } = useSetUp();
  const body: React.ReactElement = useMemo(() => {
    if (setUpLoading) {
      return <Loader width={200} height={200} />;
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
    <main className="flex flex-col items-center justify-center h-full">
      {body}
    </main>
  );
}
