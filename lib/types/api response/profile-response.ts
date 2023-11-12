import APIResponse from "./api-response";
import { Prisma } from "@prisma/client";

export interface S_ProfileResponse extends APIResponse {
  data: Prisma.ProfileSelect;
}

export interface M_ProfileResponse extends APIResponse {
  data: Prisma.ProfileSelect[];
}
