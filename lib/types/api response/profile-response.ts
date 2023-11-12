import APIResponse from "./api-response";
import { Profile } from "@prisma/client";

export interface S_ProfileResponse extends APIResponse {
  data: Profile;
}

export interface M_ProfileResponse extends APIResponse {
  data: Profile[];
}
