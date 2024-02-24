"use client";

import { S_ServerResponse } from "@/lib/types/api-response";
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
import React, { useCallback } from "react";
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
  name: z.string().min(1, { message: "Your server needs a name" }),
  imageUrl: z.string(),
});

const CreateServerModal = () => {
  const { data: session } = useSession();
  const modal = useModal();
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { mutate } = useSWRConfig();
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const res = await axios.post<S_ServerResponse>("/api/server", values);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        toast.success(`You have created the ${res.data.data.name} server`);
        setTimeout(() => {
          form.reset();
          modal.onClose();
        }, 200);
        mutate(`/api/server`);
        mutate(`/api/server/${modal.data.server?.id}`);
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [modal, mutate, form]
  );

  const handleClose = () => {
    form.reset();
    modal.onClose();
  };

  return (
    <Dialog
      open={modal.isOpen && modal.type == "createServer"}
      onOpenChange={handleClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0 offset-0">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Create server</DialogTitle>
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
                      <div className="flex justify-center w-full mt-5 rounded-md cursor-pointer">
                        <FormControl>
                          <FileUpload
                            isSubmitting={form.formState.isSubmitting}
                            endpoint="serverImage"
                            onChange={field.onChange}
                            value={field.value}
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
                      <FormLabel className="mb-5 font-bold text-left">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Localhost"
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
                  Create
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default CreateServerModal;
