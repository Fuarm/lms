import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import { IconBadge } from "@/components/icon-badge";
import { ArrowLeftIcon, CircleDollarSignIcon, FileIcon, LayoutDashboardIcon, ListChecksIcon } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({
  params: {courseId}
}: {
  params: { courseId: string }
}) => {
  const { userId} = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: { orderBy: { position: "asc" } },
      attachments: { orderBy: { createdAt: "desc" } }
    }
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  })

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner variant="warning">
          This course is unpublished. It will not be visible to the students.
        </Banner>
      )}
      <div className="p-6">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-500">Complete all fields { completionText }</span>
          </div>
          <Actions
            courseId={ courseId }
            isPublished={ course.isPublished }
            disabled={ !isCompleted }
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ LayoutDashboardIcon }/>
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={ course } courseId={ courseId }/>
            <DescriptionForm initialData={ course } courseId={ courseId }/>
            <ImageForm initialData={ course } courseId={ courseId }/>
            <CategoryForm
              initialData={ course }
              courseId={ courseId }
              options={ categories.map(({id, name}) => ({label: name, value: id})) }/>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ ListChecksIcon }/>
                <h2 className="text-xl">Course chapters</h2>
              </div>

              <ChaptersForm initialData={ course } courseId={ courseId }/>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ CircleDollarSignIcon }/>
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={ course } courseId={ courseId }/>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ FileIcon }/>
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={ course } courseId={ courseId }/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;