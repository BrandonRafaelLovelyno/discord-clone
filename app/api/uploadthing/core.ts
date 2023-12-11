import { createUploadthing, type FileRouter } from "uploadthing/next";
import prismadb from "@/lib/orm/prismadb";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import options from "@/lib/auth/option";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user;
};

const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      await auth();
      return { status: "success" };
    })
    .onUploadComplete(({ metadata }) => {}),
  messageFile: f(["image", "pdf"])
    .middleware(async ({ req }) => {
      await auth();
      return { status: "success" };
    })
    .onUploadComplete(({ metadata }) => {}),
} satisfies FileRouter;

export default ourFileRouter;

export type OurFileRouter = typeof ourFileRouter;
