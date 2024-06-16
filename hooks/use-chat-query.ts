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
  const fetchMessages = async ({ pageParam }: { pageParam: string }) => {
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
    getNextPageParam: (lastPage) => lastPage?.data.nextCursor,
    refetchInterval: 50,
    initialPageParam: "-1",
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
