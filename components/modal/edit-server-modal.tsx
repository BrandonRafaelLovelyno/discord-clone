"use client";

import {
  APIResponse,
  S_ServerResponse,
  S_ServerWithChannelWithProfileResponse,
} from "@/lib/types/api-response";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import FileUpload from "../file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, "Your server needs a name"),
  imageUrl: z.string().min(1, "Your server needs an image"),
});

const EditServerModal = () => {
  const { mutate } = useSWRConfig();
  const modal = useModal();
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const res = await axios.patch<S_ServerWithChannelWithProfileResponse>(
          `/api/server/${modal.data.server?.id}`,
          values
        );
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        await mutate(`/api/server`);
        await mutate(`/api/server/${modal.data.server?.id}`);
        modal.onOpen("editServer", { server: res.data.data });
        toast.success("Server updated");
        form.reset();
        modal.onClose();
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [modal, form, mutate]
  );
  useEffect(() => {
    if (modal.data.server) {
      form.setValue("name", modal.data.server.name);
      form.setValue("imageUrl", modal.data.server.imageUrl);
    }
  }, [modal, form]);
  return (
    <Dialog
      open={modal.isOpen && modal.type == "editServer"}
      onOpenChange={modal.onClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0 offset-0">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Edit server</DialogTitle>
            <DialogDescription className="text-center">
              Give your server personality with an image and a title
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center justify-center px-5 gap-y-8">
                <FormField
                  name="imageUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center w-full h-fit">
                      <FormLabel className="self-start font-bold text-left">
                        Server Image
                      </FormLabel>
                      <div className="flex justify-center w-full rounded-md cursor-pointer mt-7">
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            onChange={field.onChange}
                            value={field.value}
                            isSubmitting={form.formState.isSubmitting}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="w-full font-bold text-left" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-bold text-left">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={modal.data.server?.name}
                          className=""
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-bold" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-3 py-5 mt-10 bg-stone-900">
                <Button
                  variant="primary"
                  disabled={form.formState.isSubmitting}
                >
                  Edit
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default EditServerModal;
