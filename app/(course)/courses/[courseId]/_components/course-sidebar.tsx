import type { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";

import { CourseSidebarClient } from "./course-sidebar-client";

interface CourseSidebarProps {
  course: Course & {
    chapters: Array<Chapter & {
      userProgress: UserProgress[] | null;
    }>;
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount
}: CourseSidebarProps) => {

  const {userId} = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id
      }
    }
  });

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <CourseSidebarClient course={course} purchase={purchase} progressCount={progressCount} />
    </div>
  );
}