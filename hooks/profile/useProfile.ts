import fetcher from "@/lib/fetcher";
import ProfileResponse from "@/lib/types/api/profile-response";
import useSwr from "swr";

const useProfile = () => {
  const { data, isLoading, mutate } = useSwr<ProfileResponse>(
    "/api/profile",
    fetcher
  );
  return { data, isLoading, mutate };
};

export default useProfile;
