import { useSocket } from "@/components/provider/socket-provider";
import { MessageWithMemberWithProfile } from "@/lib/types/collection";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSocketProps {
  queryKey: string;
  updateKey: string;
  addKey: string;
}

const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: InfiniteData<any, unknown> | undefined) => {
          if (!oldData || !oldData.pages || oldData.pages.length == 0) {
            return oldData;
          }
          const newPages = oldData.pages.map(
            (page: { data: { messages: MessageWithMemberWithProfile[] } }) => ({
              ...page,
              data: {
                messages: page.data.messages.map((m) => {
                  if (m.id == message.id) {
                    return message;
                  } else {
                    return m;
                  }
                }),
              },
            })
          );
          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: InfiniteData<any, unknown>) => {
          if (!oldData || !oldData.pages || oldData.pages.length == 0) {
            return {
              pages: [
                {
                  data: {
                    message: [message],
                  },
                },
              ],
            };
          }
          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            data: {
              messages: [message, ...newPages[0].data.messages],
            },
          };

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [socket, queryClient, addKey, updateKey, queryKey]);
};

export default useChatSocket;
