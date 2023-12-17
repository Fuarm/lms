import db from "@/lib/db";

import { Categories } from "./_components/categories";
import { CoursesList } from "./_components/courses-list";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  const courses = await getCourses({
    userId,
    ...searchParams
  });

  return (
    <div className="p-6 space-y-6">
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
  );
}

export default SearchPage;