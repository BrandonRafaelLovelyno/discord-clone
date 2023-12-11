import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Plus, Smile } from "lucide-react";
import axios from "axios";
import qs from "query-string";

interface ChatInputProps {
  name: string;
  apiUrl: string;
  type: "conversation" | "channel";
  query: Record<string, string>;
}

const formSchema = z.object({
  chat: z.string().min(1),
});

const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, type, name, query }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat: "",
    },
  });
  const isLoading: boolean = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      const res = await axios.post(url, values);
      form.reset();
    } catch (err) {}
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="chat"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    placeholder={`Message ${
                      type == "conversation" ? name : `# ${name}`
                    }`}
                    disabled={isLoading}
                    {...field}
                    className="py-6 border-0 border-none px-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
};

export default ChatInput;
