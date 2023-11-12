import { Server } from "@prisma/client";
import APIResponse from "./api-response";

export interface S_ServerResponse extends APIResponse {
  data: Server;
}

export interface M_ServerResponse extends APIResponse {
  data: Server[];
}
