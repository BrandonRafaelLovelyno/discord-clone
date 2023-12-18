import {
  Channel,
  Conversation,
  Member,
  Message,
  Profile,
  Server,
} from "@prisma/client";

export type ServerWithMemberwithProfile = Server & {
  members: MemberWithProfile;
};

export type ServerWithChannelWithMemberWithProfile = Server & {
  channels: Channel[];
  members: (Member & { profile: Profile })[];
};

export type ConversationWithMemberWithProfile = Conversation & {
  memberOne: Member & { profile: Profile };
  memberTwo: Member & { profile: Profile };
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
