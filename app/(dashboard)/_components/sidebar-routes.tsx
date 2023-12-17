"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { BarChartIcon, CompassIcon, LayoutIcon, ListIcon } from "lucide-react";
import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import Logo from "@/components/logo";

const guestRoutes = [
  {
    icon: LayoutIcon,
    label: "Dashboard",
    href: "/"
  },
  {
    icon: CompassIcon,
    label: "Browse",
    href: "/search"
  }
]

const teacherRoutes = [
  {
    icon: ListIcon,
    label: "Courses",
    href: "/teacher/courses"
  },
  {
    icon: BarChartIcon,
    label: "Analytics",
    href: "/teacher/analytics"
  }
]

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(-2);
    routes.map(({ href }, i) => {
      if (pathname === href || pathname?.startsWith(`${href}/`)) {
        setActiveIndex(i);
      }
    });
  }, [pathname, routes])

  return (
    <>
      <div className={cn("h-24 pl-6 flex items-center border-r bg-white z-[2]", activeIndex === 0 && "md:rounded-br-3xl md:transition-[border-radius] duration-500 shadow")}>
        <Logo />
      </div>
      {
        routes.map((route, i) => (
          <SidebarItem key={route.href} index={i} activeIndex={activeIndex} {...route} />
        ))
      }
      <div className={cn("flex-grow border-r bg-white", activeIndex === routes.length - 1 && "md:rounded-tr-3xl md:transition-[border-radius] duration-500 shadow")}></div>
    </>
  );
}

export default SidebarRoutes;
