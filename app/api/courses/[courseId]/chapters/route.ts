import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import db from "@/lib/db";

export async function POST(req: Request, { params: { courseId } }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" }
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: { courseId, title, position: newPosition }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSE_ID_CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}