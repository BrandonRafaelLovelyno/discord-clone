import { ServerWithChannelWithMemberWithProfile } from "@/lib/types/collection";
import { Server } from "@prisma/client";
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
  server?: ServerWithChannelWithMemberWithProfile;
}

interface ModalStore {
  onOpen: (type: ModalType, data?: ModalData) => void;
  isOpen: boolean;
  type: ModalType;
  data: ModalData;
  onClose: () => void;
}

const useModal = create<ModalStore>((set) => ({
  data: {},
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  type: "createServer",
}));

export default useModal;
