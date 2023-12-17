import Image from "next/image";
import { CSSProperties } from "react";

interface LandingProps {
  size?: number;
  isLoading?: boolean;
}

export const Landing = (
  { size = 20, isLoading = false }: LandingProps
) => {
  return (
    <Image
      width={size}
      height={size}
      style={{ "--loading-opacity": isLoading ? 0.1 : 1 } as CSSProperties}
      src={isLoading ? "/loading.svg" : "/loaded.svg"}
      alt="loading"
    />
  );
}
