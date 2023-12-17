"use client";

import type { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";

interface CourseSidebarClientProps {
  course: Course & {
    chapters: Array<Chapter & {
      userProgress: UserProgress[] | null;
    }>;
  };
  purchase: Purchase | null;
  progressCount: number;
}

export const CourseSidebarClient = ({
  course,
  purchase,
  progressCount
}: CourseSidebarClientProps) => {
  const pathname= usePathname();

  const [activeIndex, setActiveIndex] = useState(-2);

  useEffect(() => {
    course.chapters.map(({ id }, i) => {
      if (pathname?.includes(id)) {
        setActiveIndex(i);
      }
    });
  }, [course.chapters, pathname]);

  return (
    <>
      <div
        className={ cn("min-h-[94px] py-4 space-y-2 px-6 grid items-center border-r bg-white z-[2]", activeIndex === 0 && "md:rounded-br-3xl md:transition-[border-radius] duration-500 shadow") }>
        <h1 className="font-semibold line-clamp-2 text-ellipsis">{course.title}</h1>
        {purchase && (
          <CourseProgress variant="success" value={progressCount} />
        )}
      </div>
      {
        course.chapters.map((chapter, i) => (
          <CourseSidebarItem
            key={chapter.id}
            index={i}
            activeIndex={activeIndex}
            id={chapter.id}
            courseId={course.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isLocked={!chapter.isFree && !purchase}
          />
        ))
      }
      <div
        className={ cn("flex-grow border-r bg-white", activeIndex === course.chapters.length - 1 && "md:rounded-tr-3xl md:transition-[border-radius] duration-500 shadow") }></div>
    </>
  );
}