import fetcher from "@/lib/fetcher";
import {
  M_ServerResponse,
  S_ServerResponse,
} from "@/lib/types/api response/server-response";
import useSWR from "swr";

const useServer = ({
  serverId,
  profileId,
}: {
  serverId?: string;
  profileId?: string;
}) => {
  if (serverId) {
    return useSWR<S_ServerResponse>(`/api/server/${serverId!}`, fetcher);
  } else {
    return useSWR<M_ServerResponse>(
      `/api/server?profileId=${profileId!}`,
      fetcher
    );
  }
};

export default useServer;
