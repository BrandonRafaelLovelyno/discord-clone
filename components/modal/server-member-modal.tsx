"use client";
import MotionDivUp from "../animation/motion-div-up";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "../profile-avatar";
import { S_ServerWithChannelWithProfileResponse } from "@/lib/types/api-response";
import { ScrollArea } from "../ui/scroll-area";
import LineWaveLoader from "../loader/line-wave";
import {
  Check,
  MoreVerticalIcon,
  ShieldAlert,
  ShieldCheck,
  ShieldCheckIcon,
  ShieldQuestion,
  Skull,
  User2,
} from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import ColorRingLoader from "../loader/color-ring";
import axios from "axios";
import { MemberRole } from "@prisma/client";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

const ServerMemberModal = () => {
  const router = useRouter();
  const modal = useModal();
  const { mutate } = useSWRConfig();
  const [loadingId, setLoadingId] = useState<string>("");
  const onKick = useCallback(
    async (memberId: string, name: string) => {
      try {
        setLoadingId(memberId);
        const res = await axios.post<S_ServerWithChannelWithProfileResponse>(
          `/api/member/kick/${modal.data.server?.id}?memberId=${memberId}`
        );
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        mutate(`/api/server/${modal.data.server?.id}`);
        modal.onOpen("members", { server: res.data.data });
        router.back();
        toast.success(`You have kicked ${name}`);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoadingId("");
      }
    },
    [modal, mutate, router]
  );

  const onChangeRole = useCallback(
    async (memberId: string, role: MemberRole, name: string) => {
      try {
        setLoadingId(memberId);
        const res = await axios.patch<S_ServerWithChannelWithProfileResponse>(
          `/api/member/role/${modal.data.server?.id}?memberId=${memberId}`,
          {
            role,
          }
        );
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        mutate(`/api/server/${modal.data.server?.id}`);
        modal.onOpen("members", { server: res.data.data });
        toast.success(`You have changed ${name}'s role`);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoadingId("");
      }
    },
    [modal, mutate]
  );
  const [description, body] = useMemo(() => {
    if (!modal.data.server) {
      return [null, null];
    }
    const bod = (
      <div className="flex flex-col justify-center w-full pt-3 gap-y-5">
        {modal.data.server.members.map((m) => (
          <MotionDivUp key={m.id}>
            <div className="flex flex-row items-center justify-start w-full gap-x-2">
              <ProfileAvatar imageUrl={m.profile.imageUrl} />
              <div className="flex flex-col text-sm gap-y-1">
                <div className="flex items-center gap-x-1">
                  <p>{m.profile.name}</p>
                  <MotionDivUp key={m.role}>{roleIconMap[m.role]}</MotionDivUp>
                </div>
                <p className="text-gray-400">{m.profile.email}</p>
              </div>
              <div className="ml-auto mr-5">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {modal.data.server!.profileId !== m.profileId &&
                      loadingId !== m.id && (
                        <MotionDivUp key={`${m.id}-vertical`}>
                          <MoreVerticalIcon className="h-5" />
                        </MotionDivUp>
                      )}
                    {loadingId === m.id && (
                      <MotionDivUp key={`${m.id}-loading`}>
                        <ColorRingLoader width={40} height={40} />
                      </MotionDivUp>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center justify-center w-full py-2 gap-x-2">
                        <ShieldQuestion className="w-4 h-4" />
                        <span>Role</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          className="z-10 flex items-center justify-center py-2 cursor-pointer bg-stone-800 gap-x-2"
                          onClick={() =>
                            onChangeRole(m.id, "GUEST", m.profile.name)
                          }
                        >
                          <User2 className="w-4 h-4 mr-2" />
                          <span>Guest</span>
                          {m.role === "GUEST" && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="z-10 flex items-center justify-center py-2 cursor-pointer bg-stone-800 gap-x-2"
                          onClick={() =>
                            onChangeRole(m.id, "MODERATOR", m.profile.name)
                          }
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                          <span>Moderator</span>
                          {m.role === "MODERATOR" && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      className="flex items-center justify-center py-2 cursor-pointer gap-x-2"
                      onClick={() => onKick(m.id, m.profile.name)}
                    >
                      <Skull className="w-4 h-4" />
                      <span>Kick</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </MotionDivUp>
        ))}
      </div>
    );
    const desc = <p>{modal.data.server.members.length} members</p>;
    return [desc, bod];
  }, [modal.data.server, loadingId, onChangeRole, onKick]);
  return (
    <Dialog
      open={modal.isOpen && modal.type == "members"}
      onOpenChange={modal.onClose}
    >
      <MotionDivUp>
        <DialogContent className="p-5">
          <DialogHeader className="pt-5">
            <DialogTitle className="mb-3 text-center">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              {description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="min-h-fit max-h-[420px] mt-5 w-full">
            {body ? body : <LineWaveLoader width={10} height={10} />}
          </ScrollArea>
        </DialogContent>
      </MotionDivUp>
    </Dialog>
  );
};

export default ServerMemberModal;
