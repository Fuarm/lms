import Sidebar from "@/app/(dashboard)/_components/sidebar";
import { Navbar } from "@/app/(dashboard)/_components/navbar";

const DashboardLayout = ({
 children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="h-full overflow-auto bg-gray-50">
      <div className="h-[72px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[72px] h-full">
        {children}
      </main>
    </main>
  );
}

export default DashboardLayout;