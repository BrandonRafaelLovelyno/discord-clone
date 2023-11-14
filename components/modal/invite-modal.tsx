import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";

const InviteModal = () => {
  const modal = useModal();
  const handleClose = () => {
    modal.onClose();
  };
  return (
    <Dialog
      open={modal.isOpen && modal.type == "invite"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Invite Link</DialogTitle>
            <DialogDescription className="text-center">
              Invite your friends with below link!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default InviteModal;
