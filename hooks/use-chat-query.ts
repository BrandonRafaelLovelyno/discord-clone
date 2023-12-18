import { useSocket } from "@/components/provider/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UseChatQueryProps {
  apiUrl: string;
  queryKey: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const useChatQuery = ({
  apiUrl,
  queryKey,
  paramKey,
  paramValue,
}: UseChatQueryProps) => {
  const { isConnected } = useSocket();
  const fetchMessages = async ({ pageParam }: { pageParam: number }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: 0,
  });
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};

export default useChatQuery;
