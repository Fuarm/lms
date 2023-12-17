import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";

import { FileIcon } from "lucide-react";
import { Banner } from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseEnrollButton } from "./_components/course-enroll-button";

const ChapterIdPage = async ({
  params: { courseId, chapterId }
}: {
  params: { courseId: string; chapterId: string; }
}) => {
  const {userId} = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase
  } = await getChapter({ userId, chapterId, courseId });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <>
      {userProgress?.isCompleted && (
        <Banner variant="success">
          You already completed this chapter.
        </Banner>
      )}
      {isLocked && (
        <Banner variant="warning">
          You need to purchase this course to watch this chapter.
        </Banner>
      )}
      <div className="p-6 grid grid-cols-1 2xl:grid-cols-[auto_360px] gap-4">
        <VideoPlayer
          chapterId={chapterId}
          courseId={courseId}
          playbackId={muxData?.playbackId!}
          nextChapterId={nextChapter?.id}
          title={chapter.title}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 h-fit gap-y-4">
          <h2 className="text-2xl font-semibold text-center lg:text-left">{chapter.title}</h2>
          <div className="justify-self-stretch lg:justify-self-end 2xl:justify-self-stretch">
            {purchase ? (
              <CourseProgressButton
                courseId={courseId}
                chapterId={chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          {!!attachments.length && (
            <>
              <Separator className="col-span-1 lg:col-span-2 2xl:col-span-1" />
              {attachments.map(attachment => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <FileIcon className="w-4 h-4 mr-1" />
                  <p>{attachment.name}</p>
                </a>
              ))}
            </>
          )}
        </div>
      </div>
      <Separator />
      <div className="px-6 py-4">
        <Preview value={chapter.description!} />
      </div>
    </>
  );
}

export default ChapterIdPage;