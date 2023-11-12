import { Prisma } from "@prisma/client";
import APIResponse from "./api-response";

export interface S_ServerResponse extends APIResponse {
  data: Prisma.ServerSelect;
}

export interface M_ServerResponse extends APIResponse {
  data: Prisma.ServerSelect[];
}
