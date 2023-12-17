import Link from "next/link";
import Image from "next/image";
import { IconBadge } from "@/components/icon-badge";
import { BookOpenIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CourseProgress } from "@/components/course-progress";

interface CoursesCardProps {
  id: string;
  title: string;
  imageUrl: string | null;
  chaptersLength?: number;
  price: number | null;
  progress: number | null;
  category?: string;
}

export const CoursesCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category
}: CoursesCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image className="object-cover" fill alt={title} src={imageUrl || ""} />
        </div>
        <p className="text-lg mt-2 md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {category}
        </p>
        <div className="my-2 flex items-center gap-x-1 text-xs md:text-sm text-slate-500">
          <IconBadge size="sm" icon={BookOpenIcon} />
          <span>{chaptersLength}</span>
          <span>{chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
        </div>
        {progress !== null ? (
          <CourseProgress
            size="sm"
            variant={progress === 100 ? "success" : "default"}
            value={progress} />
        ) : (
          <p className={cn(
            "text-xs md:text-sm font-medium text-slate-700",
            !price && "text-emerald-700"
          )}>{!price ? "Free" : formatPrice(price)}</p>
        )}
      </div>
    </Link>
  );
}