import fetcher from "@/lib/fetcher";
import { S_ConversationWithOther } from "@/lib/types/api-response";
import useSWR from "swr";

const useConversation = (memberId: string, serverId: string) => {
  const { data, isLoading, mutate } = useSWR<S_ConversationWithOther>(
    `/api/conversation?memberId=${memberId}&serverId=${serverId}`,
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useConversation;
