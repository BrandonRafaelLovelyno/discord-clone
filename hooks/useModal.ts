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

interface ModalStore {
  onOpen: (type: ModalType) => void;
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
}

const useServerModal = create<ModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (type) => set({ type, isOpen: true }),
  type: "createServer",
}));
