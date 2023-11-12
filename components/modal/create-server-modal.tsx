"use client";

import { S_ServerResponse } from "@/lib/types/api response/server-response";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { DialogFooter, DialogHeader } from "../ui/dialog";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Your server needs a name" }),
  imageUrl: z.string().min(1, { message: "Give your server an image!" }),
});

const CreateServer = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const onSumbit = async (values: z.infer<typeof formSchema>) => {
    console.log("on submit called");
    try {
      const res = await axios.post<S_ServerResponse>("/api/server", values);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      toast.success(`Welcome to ${res.data.data.name} server`);
      setTimeout(() => {
        form.reset();
        router.refresh();
        window.location.reload();
      }, 200);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Dialog open>
      <DialogContent className="p-0 offset-0">
        <DialogHeader className="pt-5">
          <DialogTitle className="text-center">Customize Server</DialogTitle>
          <DialogDescription className="text-center">
            Give your server personality with an image and a title
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSumbit)}>
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
                      <Input placeholder="Localhost" className="" {...field} />
                    </FormControl>
                    <FormMessage className="font-bold" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-3 py-5 mt-10 bg-stone-900">
              <Button variant="primary" disabled={form.formState.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServer;
