import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import Link from "next/link";
import { ArrowLeftIcon, EyeIcon, LayoutDashboardIcon, VideoIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { AccessForm } from "./_components/access-form";
import { VideoForm } from "./_components/video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import { boolean } from "zod";

interface ChapterIdPageProps {
  params: { courseId: string; chapterId: string }
}

const ChapterIdPage = async ({
 params: { courseId, chapterId }
}: ChapterIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId },
    include: { muxData: true }
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner variant="warning">
          This chapter is unpublished. It will not be visible in the course.
        </Banner>
      )}
      <div className="p-6">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={ `/teacher/courses/${ courseId }/` }
              className="flex items-center text-sm hover:opacity-75 transition mb-4 gap-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4"/>
              Back to course setup
            </Link>
            <h1 className="text-2xl font-medium">Chapter creation</h1>
            <span className="text-sm text-slate-500">Complete all fields { completionText }</span>
          </div>
          <ChapterActions
            courseId={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
            disabled={!isCompleted}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ LayoutDashboardIcon }/>
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <TitleForm initialData={ chapter } courseId={ courseId } chapterId={ chapterId }/>
              <DescriptionForm initialData={ chapter } courseId={ courseId } chapterId={ chapterId }/>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ EyeIcon }/>
                <h2 className="text-xl">Access settings</h2>
              </div>
              <AccessForm initialData={ chapter } courseId={ courseId } chapterId={ chapterId }/>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ VideoIcon }/>
              <h2 className="text-xl">Add a video</h2>
            </div>
            <VideoForm initialData={ chapter } courseId={ courseId } chapterId={ chapterId }/>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChapterIdPage;
