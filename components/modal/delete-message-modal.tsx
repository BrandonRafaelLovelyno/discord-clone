"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import qs from "query-string";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

const DeleteMessageModal = () => {
  const modal = useModal();
  const handleClose = () => {
    modal.onClose();
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(modal.data);
      const url = qs.stringifyUrl({
        url: modal.data.apiUrl!,
        query: modal.data.query!,
      });
      const res = await axios.delete(url);
      if (!res.data) {
        throw new Error("Something went wrong");
      }
      modal.onClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={modal.isOpen && modal.type == "deleteMessage"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to do this ?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-red-700">
            This message will be permanently deleted
          </div>
          <DialogFooter className="px-3 py-5 mt-10 bg-stone-900">
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={onSubmit}
            >
              Delete message
            </Button>
          </DialogFooter>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default DeleteMessageModal;
