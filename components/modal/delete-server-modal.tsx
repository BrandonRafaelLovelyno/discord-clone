"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import axios from "axios";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";
import { useSWRConfig } from "swr";
import { S_ServerResponse } from "@/lib/types/api-response";

const formSchema = z.object({
  name: z.string().min(1, { message: "Type the server name" }),
});

const DeleteServerModal = () => {
  const { mutate } = useSWRConfig();
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.name !== modal.data.server?.name) {
        throw new Error("Invalid server name");
      }
      const res = await axios.delete<S_ServerResponse>(
        `/api/server/${modal.data.server?.id}`
      );
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      toast.success(`You have deleted the ${modal.data.server?.name} server`);
      await mutate("/api/server");
      form.reset();
      modal.onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  return (
    <Dialog
      open={modal.isOpen && modal.type == "deleteServer"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0 offset-0 max-w-[80%]">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Leave Server</DialogTitle>
            <DialogDescription className="text-center">
              You are deleting the
              <span className="mx-2 font-bold text-purple-600">
                {modal.data.server?.name}
              </span>
              server!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-x-3">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Button
                    variant="destructive"
                    disabled={form.formState.isSubmitting}
                  >
                    Delete server
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default DeleteServerModal;
