"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, LockIcon, PlayCircleIcon } from "lucide-react";

interface CourseSidebarItemProps {
  index: number;
  activeIndex: number;
  label: string;
  id: string;
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  index,
  activeIndex,
  id,
  courseId,
  label,
  isCompleted,
  isLocked
}: CourseSidebarItemProps) => {
  const router = useRouter();

  const Icon = isLocked ? LockIcon : (isCompleted ? CheckCircleIcon : PlayCircleIcon);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className={ cn("w-full bg-white border-r",
      index === activeIndex - 1
        ? "z-[1] md:rounded-br-3xl md:transition-[border-radius] duration-500 shadow"
        : index === activeIndex + 1
          ? "md:rounded-tr-3xl md:transition-[border-radius] duration-500 shadow"
          : index === activeIndex && "md:border-r-0 md:transition-[background-image] duration-500 bg-gradient-to-r from-sky-200 from-[3%] via-sky-100 via-10% to-gray-50 to-80%",
      isCompleted && "from-emerald-300 via-emerald-100 to-gray-50") }
    >
      <button
        onClick={ onClick }
        className={ cn(
          "w-full flex items-center py-3 gap-x-2 text-slate-500 text-sm font-[500] pl-6 bg-transparent hover:text-slate-600 transition-all",
          index === activeIndex && "text-sky-700 hover:text-sky-700",
          isCompleted && "text-emerald-700 hover:text-emerald-700/80"
        ) }>
        <Icon size={ 22 }/>
        { label }
      </button>
    </div>
  );
}