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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import qs from "query-string";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../file-upload";
import { Button } from "../ui/button";
import useModal from "@/hooks/useModal";
import MotionDivUp from "../animation/motion-div-up";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  fileUrl: z.string().min(1, "Please attach a pdf/img"),
});

const MessageFileModal = () => {
  const { data: session } = useSession();
  const modal = useModal();
  const form = useForm({
    defaultValues: {
      fileUrl: "",
    },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const url = qs.stringifyUrl({
          url: modal.data.apiUrl || "",
          query: modal.data.query,
        });
        const res = await axios.post(url, {
          ...values,
          content: values.fileUrl,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        toast.success("File uploaded");
        form.reset();
        modal.onClose();
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
    [form, modal]
  );

  return (
    <Dialog
      open={modal.isOpen && modal.type == "messageFile"}
      onOpenChange={modal.onClose}
    >
      <MotionDivUp>
        <DialogContent className="p-0 offset-0 max-w-[80%]">
          <DialogHeader className="pt-5">
            <DialogTitle className="text-center">Attach File</DialogTitle>
            <DialogDescription className="text-center">
              Attach a pdf or an image file
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center justify-center px-5 gap-y-8">
                <FormField
                  name="fileUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center w-full h-fit">
                      <FormLabel className="self-start mb-5 font-bold text-left">
                        Attachment
                      </FormLabel>
                      <div className="flex justify-center w-full rounded-md cursor-pointer mt-7">
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
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
              </div>
              <DialogFooter className="px-3 py-5 mt-10 bg-stone-900">
                <Button
                  variant="primary"
                  disabled={form.formState.isSubmitting}
                >
                  Send
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default MessageFileModal;
