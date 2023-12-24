import fetcher from "@/lib/fetcher";
import { S_ProfileResponse } from "@/lib/types/api-response";
import useSwr from "swr";

const useProfile = () => {
  const { data, isLoading, mutate } = useSwr<S_ProfileResponse>(
    "/api/profile",
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useProfile;
