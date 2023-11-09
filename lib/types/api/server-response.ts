import { Prisma } from "@prisma/client";
import APIResponse from "./api-response";

interface ServerResponse extends APIResponse {
  data: Prisma.ServerSelect;
}

export default ServerResponse;
