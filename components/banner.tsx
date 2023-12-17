import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-500 border-emerald-400 text-secondary"
      }
    },
    defaultVariants: {
      variant: "warning"
    }
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants>{
  children: string | ReactNode;
}

const iconMap = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon
}
export const Banner = ({
  children,
  variant
}: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </div>
  );
}