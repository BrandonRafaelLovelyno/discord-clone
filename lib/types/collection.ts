import { Channel, Conversation, Member, Profile, Server } from "@prisma/client";

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
