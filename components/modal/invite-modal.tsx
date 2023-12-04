"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";
import { Input } from "../ui/input";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import useOrigin from "@/hooks/useOrigin";
import { S_ServerResponse } from "@/lib/types/api-response";
import { Button } from "../ui/button";

const InviteModal = () => {
  const origin = useOrigin();
  const modal = useModal();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inviteUrl = useMemo(() => {
    return `${origin}/invite/${modal.data.server?.inviteCode}`;
  }, [modal.data]);
  const handleClose = () => {
    modal.onClose();
  };
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    toast.success("Invite code copied");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const onClick = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch<S_ServerResponse>(
        `/api/server/${modal.data.server?.id}/invite-code`
      );
      //MODAL DATA NOT UPDATED
      toast.success("Invite code renewed");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={modal.isOpen && modal.type == "invite"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-5">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Invite Link</DialogTitle>
            <DialogDescription className="text-center">
              Invite your friends with below link!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-x-3">
            <Input value={inviteUrl} className=" ring-1 ring-white" />
            <Button
              className="text-white bg-transparent hover:bg-transparent"
              onClick={!isCopied ? onCopy : () => {}}
            >
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center text-sm gap-x-3">
            <p>Generate new link</p>
            <Button
              className="text-white bg-transparent hover:bg-transparent"
              onClick={onClick}
              disabled={isLoading}
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default InviteModal;
