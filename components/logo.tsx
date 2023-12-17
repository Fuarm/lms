import Image from "next/image";

const Logo = () => {
  return (
    <Image
      width={140}
      height={40}
      priority={true}
      src="/logo.svg"
      alt="logo"
    />
  );
}

export default Logo;
