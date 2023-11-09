import { createUploadthing, type FileRouter } from "uploadthing/next";
import prismadb from "@/lib/orm/prismadb";
import { NextRequest } from "next/server";

const f = createUploadthing();

const auth = async (req: NextRequest) => {
  const body = await req.json();
  const user = await prismadb.user.findUnique({
    where: {
      id: body.userId,
    },
  });
  if (!user) {
    throw Error("Invalid userId");
  }
  return user;
};

const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // const user = await auth(req);
      return { userId: "oke" };
    })
    .onUploadComplete(({ metadata }) => {
      console.log("upload by", metadata.userId, "success");
    }),
  messageFile: f(["image", "pdf"])
    .middleware(async ({ req }) => {
      const user = await auth(req);
      return { userId: user.name };
    })
    .onUploadComplete(({ metadata }) => {
      console.log("upload by", metadata.userId, "success");
    }),
} satisfies FileRouter;

export default ourFileRouter;

export type OurFileRouter = typeof ourFileRouter;
