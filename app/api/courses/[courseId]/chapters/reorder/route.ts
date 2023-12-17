import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import db from "@/lib/db";

export async function PUT(req: Request, { params: { courseId } }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    for (let { id, position } of list) {
      await db.chapter.update({
        where: { id },
        data: { position }
      });
    }

    return new NextResponse("Success", { status: 200 });

  } catch (error)  {
    console.log("[CHAPTERS_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}