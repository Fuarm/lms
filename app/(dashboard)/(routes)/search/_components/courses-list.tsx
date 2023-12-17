import type{ CourseWithProgressWithCategory } from "@/actions/get-courses";

import { CoursesCard } from "./courses-card";

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({
  items
}: CoursesListProps) => {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-2">
        {items.map(item => (
          <CoursesCard
            key={item.id}
            {...item}
            chaptersLength={item.chapters?.length}
            category={item.category?.name}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </>
  );
}