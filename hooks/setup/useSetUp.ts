import fetcher from "@/lib/fetcher";
import ServerResponse from "@/lib/types/api/server-response";
import useSwr from "swr";

const useSetUp = () => {
  const { data, isLoading, mutate } = useSwr<ServerResponse>(
    "/api/setup",
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useSetUp;
