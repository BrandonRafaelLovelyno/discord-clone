"use client";

import { MemberWithProfile } from "@/lib/types/collection";
import { Member, MemberRole } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "../profile-avatar";
import ActionTooltip from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MotionDivUp from "../animation/motion-div-up";
import { toast } from "react-hot-toast";
import qs from "query-string";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface KeyboardEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  keyCode: number;
  preventDefault: () => void;
}

interface ChatItemProps {
  id: string;
  currentMember: Member;
  content: string;
  timeStamp: string;
  isUpdated: boolean;
  isDeleted: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
  fileUrl: string | null;
  member: MemberWithProfile;
}

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1, { message: "You should delete the chat" }),
});

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  currentMember,
  content,
  timeStamp,
  isUpdated,
  isDeleted,
  socketQuery,
  socketUrl,
  fileUrl,
  member,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode == 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
      });
      const res = await axios.patch(url, values);
      if (!res.data) {
        throw new Error("Failed to update with socket");
      }
      toast.success("Message edited");
      setIsEditing(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (currentMember.id !== member.id) {
      router.push(`/server/${params?.serverId}/member/${member.id}`);
    }
  };

  const modal = useModal();

  const fileType = content.split(".").pop();
  const isPDF = content == fileUrl && fileType == "pdf";
  const isImage = content == fileUrl && !isPDF;
  const isAdmin = currentMember.role == MemberRole.ADMIN;
  const isModerator = currentMember.role == MemberRole.MODERATOR;
  const isOwner = currentMember.profileId == member.profileId;
  const canDeleteMessage = (isAdmin || isModerator || isOwner) && !isDeleted;
  const canEditMesssage = isOwner && !isDeleted;
  return (
    <div className="relative flex p-4 gap-x-3 group hover:bg-black/5">
      <div
        className="transition cursor-pointer hover:drop-shadow-md"
        onClick={onMemberClick}
      >
        <ProfileAvatar imageUrl={member.profile.imageUrl} className="" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center gap-x-2">
          <p
            className="text-sm font-semibold cursor-pointer hover:underline"
            onClick={onMemberClick}
          >
            {member.profile.name}
          </p>

          <ActionTooltip
            label={member.role.toLowerCase()}
            align={"end"}
            side={"top"}
          >
            {roleIconMap[member.role]}
          </ActionTooltip>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {timeStamp}
          </p>
        </div>
        {isImage && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary"
          >
            <Image alt={content} src={fileUrl} fill />
          </a>
        )}
        {isPDF && (
          <div className="flex items-center px-2 py-3 mt-2 rounded-md bg-background/10">
            <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              PDF File
            </a>
          </div>
        )}
        {!fileUrl && !isEditing && (
          <MotionDivUp key={`${id} ${content} message ${isDeleted}`}>
            <p
              className={twMerge(
                "text-sm text-zinc-600 dark:text-zinc-300",
                isDeleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !isDeleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          </MotionDivUp>
        )}
        {!fileUrl && isEditing && (
          <MotionDivUp key={`${id} ${content} edit ${isDeleted}`}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full py-2 gap-x-3">
                        <Input
                          {...field}
                          placeholder="Edit your message"
                          className="flex-1 p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                        />
                        <Button
                          disabled={form.formState.isSubmitting}
                          variant="primary"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </FormProvider>
            <span className="text-[10px] text-zinc-400">
              Press esc to cancel
            </span>
          </MotionDivUp>
        )}
        {canDeleteMessage && (
          <div className="absolute hidden p-1 mt-2 bg-white border rounded-sm group-hover:flex -top-2 right-5 gap-x-3 dark:bg-zinc-800">
            {canEditMesssage && (
              <ActionTooltip label="Edit" align="end" side="top">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 "
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete" align="end" side="top">
              <Trash
                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 "
                onClick={() => {
                  modal.onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  });
                }}
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
