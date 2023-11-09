import APIResponse from "./api-response";
import { Prisma } from "@prisma/client";

interface ProfileResponse extends APIResponse {
  data: Prisma.ProfileSelect;
}

export default ProfileResponse;
