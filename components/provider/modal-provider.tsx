"use client";

import React, { useEffect, useState } from "react";
import CreateServerModal from "../modal/create-server-modal";
import { cn } from "@/lib/utils";
import InviteModal from "../modal/invite-modal";
import EditServerModal from "../modal/edit-server-modal";
import ServerMemberModal from "../modal/server-member-modal";
import CreateChannelModal from "../modal/create-channel-modal";
import LeaveServerModal from "../modal/leave-server-modal";
import DeleteServerModal from "../modal/delete-server-modal";
import EditChannelModal from "../modal/edit-channel-modal";
import MessageFileModal from "../modal/message-file-modal";
import DeleteMessageModal from "../modal/delete-message-modal";
import DeleteChannelModal from "../modal/delete-channel-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DeleteChannelModal />
      <DeleteMessageModal />
      <MessageFileModal />
      <EditChannelModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <CreateChannelModal />
      <ServerMemberModal />
      <EditServerModal />
      <CreateServerModal />
      <InviteModal />
    </>
  );
};

export default ModalProvider;
