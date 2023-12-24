import fetcher from "@/lib/fetcher";
import { S_ConversationWithOtherWithCurrentResponse } from "@/lib/types/api-response";
import useSWR from "swr";

const useConversation = (memberId: string, serverId: string) => {
  const { data, isLoading, mutate } =
    useSWR<S_ConversationWithOtherWithCurrentResponse>(
      `/api/conversation?memberId=${memberId}&serverId=${serverId}`,
      fetcher
    );
  return { data, isLoading, mutate };
};

export default useConversation;
