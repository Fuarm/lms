import type { Category, Course } from "@prisma/client";
import db from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true, title: { contains: title }, categoryId },
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true }
        },
        purchases: {
          where: { userId }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return await Promise.all(
      courses.map(async course => {
        if (course.purchases.length === 0) {
          return {...course, progress: null}
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {...course, progress: progressPercentage}
      })
    );
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}