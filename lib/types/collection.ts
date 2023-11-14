import { Channel, Member, Profile, Server } from "@prisma/client";

export type ServerWithMemberwithProfile = Server & {
  members: Member & { profile: Profile };
};

export type ServerWithChannelWithMemberWithProfile = Server & {
  channels: Channel[];
  members: Member[] & { profile: Profile };
};
