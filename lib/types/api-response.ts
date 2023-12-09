import {
  Channel,
  Conversation,
  Member,
  MemberRole,
  Profile,
  Server,
} from "@prisma/client";
import {
  ConversationWithMember,
  ServerWithChannelWithMemberWithProfile,
} from "./collection";

export interface APIResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface S_ProfileResponse extends APIResponse {
  data: Profile;
}

export interface M_ProfileResponse extends APIResponse {
  data: Profile[];
}

export interface S_ServerResponse extends APIResponse {
  data: Server;
}

export interface M_ServerResponse extends APIResponse {
  data: Server[];
}

export interface S_ServerWithChannelWithProfileResponse extends APIResponse {
  data: ServerWithChannelWithMemberWithProfile;
}

export interface S_ServerWithRoleResponse extends APIResponse {
  data: { server: ServerWithChannelWithMemberWithProfile; role: MemberRole };
}

export interface S_ChannelResponse extends APIResponse {
  data: Channel;
}

export interface S_ConversationWithOther extends APIResponse {
  data: {
    conversation: ConversationWithMember;
    otherMember: Member;
  };
}
