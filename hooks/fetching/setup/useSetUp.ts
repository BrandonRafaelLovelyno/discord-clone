import fetcher from "@/lib/fetcher";
import { S_ServerResponse } from "@/lib/types/api response/server-response";
import useSwr from "swr";

const useSetUp = () => {
  const { data, isLoading, mutate } = useSwr<S_ServerResponse>(
    "/api/setup",
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useSetUp;
