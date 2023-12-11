import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  apiUrl?: string;
  query?: Record<string, any>;
  server?: ServerWithChannelWithMemberWithProfile;
  channelType?: ChannelType;
  channel?: Channel;
}

interface ModalStore {
  onOpen: (type?: ModalType, data?: ModalData) => void;
  isOpen: boolean;
  type: ModalType;
  data: ModalData;
  onClose: () => void;
}

const useModal = create<ModalStore>((set, get) => ({
  data: {},
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (type, data = {}) => {
    const { channelType, channel, server, apiUrl, query } = data;
    if (!server) {
      set({
        type,
        isOpen: true,
        data: {
          channelType,
          channel,
          apiUrl,
          query,
          server: get().data.server,
        },
      });
    } else {
      set({ type, isOpen: true, data });
    }
  },
  type: "createServer",
}));

export default useModal;
