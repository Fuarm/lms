"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  index: number;
  activeIndex: number;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  index,
  activeIndex
}: SidebarItemProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(href);
  }

  return (
    <div className={cn("w-full bg-white border-r",
      index === activeIndex - 1
        ? "z-[1] md:rounded-br-3xl md:transition-[border-radius] duration-500 shadow"
        : index === activeIndex + 1
          ? "md:rounded-tr-3xl md:transition-[border-radius] duration-500 shadow"
          : index === activeIndex && "md:border-r-0 md:transition-[background-image] duration-500 bg-gradient-to-r from-sky-200 from-[3%] via-sky-100 via-10% to-gray-50 to-80%" )}
    >
      <button
        onClick={onClick}
        className={cn(
        "w-full flex items-center py-3 gap-x-2 text-slate-500 text-sm font-[500] pl-6 bg-transparent hover:text-slate-600 transition-all",
          index === activeIndex && "text-sky-700 hover:text-sky-700"
      )}>
       <Icon size={22} />
        {label}
      </button>
    </div>
  )
}

export default SidebarItem;