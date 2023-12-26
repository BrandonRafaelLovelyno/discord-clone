import {
  Channel,
  Conversation,
  Member,
  MemberRole,
  Message,
  Profile,
  Server,
} from "@prisma/client";
import {
  ConversationWithMemberWithProfile,
  MemberWithProfile,
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

export interface S_ChannelResponseWithCurrentMemberResponse
  extends APIResponse {
  data: {
    channel: Channel;
    currentMember: MemberWithProfile;
  };
}

export interface S_ConversationWithOtherWithCurrentResponse
  extends APIResponse {
  data: {
    conversation: ConversationWithMemberWithProfile;
    otherMember: MemberWithProfile;
    currentMember: MemberWithProfile;
  };
}

export interface S_MessageResponse extends APIResponse {
  data: Message;
}
