import SidebarRoutes from "@/app/(dashboard)/_components/sidebar-routes";

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <SidebarRoutes />
    </div>
  );
}

export default Sidebar;
