"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
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
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Type the server name" }),
});

const LeaveServerModal = () => {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(formSchema),
  });
  const modal = useModal();
  const handleClose = () => {
    modal.onClose();
  };
  const onClick = async () => {
    try {
      const res = await axios.patch<S_ServerResponse>(
        `/api/server/${modal.data.server?.id}/invite-code`
      );
      //MODAL DATA NOT UPDATED
      toast.success("Invite code renewed");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
    }
  };
  return (
    <Dialog
      open={modal.isOpen && modal.type == "leaveServer"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Leave Server</DialogTitle>
            <DialogDescription className="text-center">
              You are leaving the
              <span className="mx-2 font-bold text-purple-600">
                {modal.data.server?.name}
              </span>
              server!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-x-3">
            <FormProvider {...form}>
              <form>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full px-5">
                      <FormLabel>Server name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value}
                          className="w-full ring-1 ring-white"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="px-3 py-5 mt-10 bg-stone-900">
                  <Button variant="destructive">Leave server</Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default LeaveServerModal;
