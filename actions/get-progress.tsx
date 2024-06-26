import db from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
) => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true }
    });

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: { userId, chapterId: { in: publishedChapterIds }, isCompleted: true }
    });

    return (validCompletedChapters / publishedChapterIds.length) * 100;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
}