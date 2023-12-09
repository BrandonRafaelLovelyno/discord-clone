import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "@/lib/orm/prismadb";

const options: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      const userDoc = await prismadb.user.findUnique({
        where: {
          email: token.email!,
        },
      });
      if (!userDoc) {
        throw new Error("Unauthorized");
      }
      const profileDoc = await prismadb.profile.findUnique({
        where: {
          userId: userDoc.id,
        },
      });
      token.profileId = profileDoc?.id || "";
      return token;
    },
    async session({ session, token, user }) {
      session.user.profileId = token.profileId as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};

export default options;
