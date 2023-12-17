import MobileSidebar from "@/app/(dashboard)/_components/mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";

export const Navbar = () => {
  return (
    <div className="h-[72px] p-4 border-b flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}