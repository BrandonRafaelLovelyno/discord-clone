"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import MotionDivUp from "../animation/motion-div-up";
import useModal from "@/hooks/useModal";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { ChannelType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(1, { message: "Your channel needs a name" }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
  const modal = useModal();
  const form = useForm({
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
    resolver: zodResolver(formSchema),
  });
  return (
    <Dialog open={modal.type == "createChannel" && modal.isOpen}>
      <DialogContent>
        <MotionDivUp>
          <DialogHeader>
            <DialogTitle>Create channel</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form>
              <div className="flex flex-col items-center justify-center px-5 gap-y-8">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center w-full h-fit">
                      <FormLabel>Enter your server name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Localhost"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </FormProvider>
        </MotionDivUp>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
