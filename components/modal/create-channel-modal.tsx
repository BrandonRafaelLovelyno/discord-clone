"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import MotionDivUp from "../animation/motion-div-up";
import useModal from "@/hooks/useModal";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { ChannelType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { S_ServerWithChannelWithProfileResponse } from "@/lib/types/api-response";
import { useSWRConfig } from "swr";

const formSchema = z.object({
  name: z.string().min(1, { message: "Your channel needs a name" }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
  const { mutate } = useSWRConfig();
  const modal = useModal();

  const form = useForm({
    defaultValues: {
      name: "",
      type: modal.data.channelType || ChannelType.TEXT,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!modal.data.channelType) return;
    form.setValue("type", modal.data.channelType);
  }, [modal, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post<S_ServerWithChannelWithProfileResponse>(
        `/api/channel?serverId=${modal.data.server?.id}`,
        values
      );
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      await mutate("/api/server");
      modal.onOpen("createChannel", { server: res.data.data });
      toast.success("Channel created");
      form.reset();
      modal.onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  return (
    <Dialog
      open={modal.type == "createChannel" && modal.isOpen}
      onOpenChange={() => {
        modal.onClose();
      }}
    >
      <DialogContent className="p-0 offset-0">
        <MotionDivUp>
          <DialogHeader className="pt-5 mb-5">
            <DialogTitle>Create channel</DialogTitle>
            <DialogDescription>Cooking new channel</DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center justify-center px-5 gap-y-8">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center w-full h-fit">
                      <FormLabel className="w-full text-left">
                        Enter your channel name
                      </FormLabel>
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
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full">
                      <FormLabel>Pick your server type</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          disabled={form.formState.isSubmitting}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Channel type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ChannelType).map((type) => (
                              <SelectItem
                                value={type}
                                className="text-white capitalize"
                                key={type}
                              >
                                {type.toString().toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
        </MotionDivUp>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
