"use client";

import React, { useEffect, useState } from "react";
import CreateServerModal from "../modal/create-server-modal";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import InviteModal from "../modal/invite-modal";
import EditServerModal from "../modal/edit-server-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const modal = useModal();
  useEffect(() => {
    setIsMounted(true);
  });
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <EditServerModal />
      <CreateServerModal />
      <InviteModal />
    </>
  );
};

export default ModalProvider;
