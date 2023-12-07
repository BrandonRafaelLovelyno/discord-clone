import fetcher from "@/lib/fetcher";
import { S_ChannelResponse } from "@/lib/types/api-response";
import useSWR from "swr";

const useChannel = (channelId: string, serverId: string) => {
  const { data, isLoading, mutate } = useSWR<S_ChannelResponse>(
    `/api/channel/${channelId}?serverId=${serverId}`,
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useChannel;
