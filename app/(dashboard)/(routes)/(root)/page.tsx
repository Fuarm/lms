import { auth } from "@clerk/nextjs";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/app/(dashboard)/(routes)/search/_components/courses-list";
import { CheckCircleIcon, ClockIcon } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const {userId} = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    coursesInProgress,
    completedCourses
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={ClockIcon}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircleIcon}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}

export default DashboardPage;