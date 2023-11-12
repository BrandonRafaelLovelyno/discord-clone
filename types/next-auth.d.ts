import { DefaultSession, Token } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      profileId: string;
      username: string;
      name: string;
      createdAt: Date;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Token {
    createdAt: Date;
    username: string;
    name: string;
    email: string;
    image: string;
    id: string;
  }
}
