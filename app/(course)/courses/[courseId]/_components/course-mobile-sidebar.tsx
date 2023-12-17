import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";
import type { Chapter, Course, UserProgress } from "@prisma/client";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: Array<Chapter & {
      userProgress: UserProgress[] | null;
    }>;
  };
  progressCount: number;
}

export const CourseMobileSidebar = ({
  course,
  progressCount
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  )
}
