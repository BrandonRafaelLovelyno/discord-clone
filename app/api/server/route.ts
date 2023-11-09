// import { NextResponse } from "next/server";
// import prismadb from "@/lib/orm/prismadb";
// import { v4 as uuidv4 } from "uuid";

// export async function POST(req: Request) {
//   try {
//     const { name, imageUrl } = await req.json();
//     const profile=
//     const newServer = await prismadb.server.create({
//       data: {
//         profileId:
//         imageUrl: imageUrl as string,
//         name: name as string,
//         inviteCode: uuidv4(),
//       },
//     });
//   } catch (err) {
//     return NextResponse.json({
//       message: (err as Error).message,
//       success: false,
//       data: {},
//     });
//   }
// }
