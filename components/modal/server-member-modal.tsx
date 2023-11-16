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
import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "../profile-avatar";
import useServer from "@/hooks/fetching/server/useServer";
import {
  APIResponse,
  S_ServerResponse,
  S_ServerWithRoleResponse,
} from "@/lib/types/api-response";
import { ScrollArea } from "../ui/scroll-area";
import LineWaveLoader from "../loader/line-wave";
import {
  Check,
  MoreVerticalIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
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

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

const ServerMemberModal = () => {
  const modal = useModal();
  const { mutate } = useSWRConfig();
  const [loadingId, setLoadingId] = useState<string>("");
  const { data, isLoading } = useServer({ serverId: modal.data.server?.id! });
  const onChangeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const res = await axios.patch<S_ServerResponse>(
        `/api/member/${modal.data.server?.id}?memberId=${memberId}`,
        {
          role,
        }
      );
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      mutate(`/api/server/${modal.data.server?.id}`);
      modal.onOpen("members", { server: res.data.data });
      toast.success("Role changed");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoadingId("");
    }
  };
  const serverData = useMemo(() => {
    if (isLoading || !data) {
      return null;
    } else {
      if (data.success) {
        return (data as S_ServerWithRoleResponse).data.server;
      } else {
        return null;
      }
    }
  }, [isLoading, data]);
  const [description, body] = useMemo(() => {
    if (!serverData) {
      return [null, null];
    } else {
      const bod = (
        <div className="flex flex-col justify-center w-full pt-3 gap-y-5">
          {serverData.members.map((m) => (
            <div className="flex flex-row items-center justify-start w-full gap-x-2">
              <ProfileAvatar imageUrl={m.profile.imageUrl} />
              <div className="flex flex-col text-sm gap-y-1">
                <div className="flex items-center gap-x-1">
                  <p>{m.profile.name}</p>
                  {roleIconMap[m.role]}
                </div>
                <p className="text-gray-400">{m.profile.email}</p>
              </div>
              <div className="ml-auto mr-5">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {serverData.profileId !== m.profileId &&
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
                      <DropdownMenuSubTrigger className="flex items-center justify-center w-full py-2">
                        <ShieldQuestion className="w-4 h-4 mr-2" />
                        <span>Role</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          className="z-10 cursor-pointer bg-stone-800"
                          onClick={() => onChangeRole(m.id, "GUEST")}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Guest
                          {m.role === "GUEST" && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="z-10 cursor-pointer bg-stone-800"
                          onClick={() => onChangeRole(m.id, "MODERATOR")}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Moderator
                          {m.role === "MODERATOR" && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      );
      const desc = <p>{serverData.members.length} members</p>;
      return [desc, bod];
    }
  }, [serverData, loadingId]);
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
