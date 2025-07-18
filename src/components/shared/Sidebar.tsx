import { adminLinks } from "@/contents/adminDashboard";
import { userLinks } from "@/contents/userDashboard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  isSidebarCollapsed: boolean;
};


type DashboardLinksProps = {
  isSidebarCollapsed: boolean;
};

const DashboardLinks = ({ isSidebarCollapsed }: DashboardLinksProps) => {
  const pathname = usePathname();

  if (pathname.includes("admin")) {
   

    return (
      <ul className="flex flex-col gap-1.5">
        {adminLinks.map(({ label, icon, href }) => {
          const isActive = pathname === href;

          return (
            <li key={label}>
              <Link
                href={href}
                className={`flex items-center gap-2 p-2 rounded-md w-full transition-all duration-200 ${isActive
                  ? "bg-white/10 text-white font-medium"
                  : "hover:bg-white/10 text-white"
                  }`}
              >
                <Icon
                  icon={icon}
                  className={`shrink-0 duration-300 ${isSidebarCollapsed ? "text-2xl" : "text-xl"
                    }`}
                />

                <span
                  className={`text-sm origin-left transition-all duration-300 ease-in-out whitespace-nowrap ${isSidebarCollapsed
                    ? "opacity-0 translate-x-2 pointer-events-none"
                    : "opacity-100 translate-x-0"
                    }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }



  return (
    <ul className="flex flex-col gap-1.5">
      {userLinks.map(({ label, icon, href }) => {
        const isActive = pathname === href;

        return (
          <li key={label}>
            <Link
              href={href}
              className={`flex items-center gap-2 p-2 rounded-md w-full transition-all duration-200 ${isActive
                ? "bg-white/10 text-white font-medium"
                : "hover:bg-white/10 text-white"
                }`}

            >
              <Icon
                icon={icon}
                className={`shrink-0 duration-300 ${isSidebarCollapsed ? "text-2xl" : "text-xl"
                  }`}
              />

              <span
                className={`text-sm origin-left transition-all duration-300 ease-in-out whitespace-nowrap ${isSidebarCollapsed
                  ? "opacity-0 translate-x-2 pointer-events-none"
                  : "opacity-100 translate-x-0"
                  }`}
              >
                {label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};


const SidebarProfile = ({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) => {
  return (
    <div className="flex items-center gap-2 ">
      <div className="w-8 h-8 rounded-full bg-gray-500 shrink-0"></div>
      <div className={`text-sm duration-500 text-white ${isSidebarCollapsed
        ? "opacity-0 translate-x-2 pointer-events-none"
        : "opacity-100 translate-x-0"
        }`}>
        <span className="block">John Doe</span>
        {/* <span className="block">Admin</span> */}
      </div>
    </div>
  );
}

function Sidebar({ isSidebarCollapsed }: SidebarProps) {
  return (
    <nav
      className={`fixed border-r-2 top-0 left-0 h-full flex flex-col justify-between p-2 shadow-md z-10 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[60px]" : "w-[250px]"
        } bg-black text-white`}
    >
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="px-2.5 py-1.5 rounded-md bg-violet-900">
            <Icon icon="heroicons:rectangle-stack-16-solid" className="text-white text-2xl" />
          </div>
          <div
            className={`transition-all duration-300 ease-in-out text-xs leading-3.5 whitespace-nowrap ${isSidebarCollapsed
              ? "opacity-0 translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0"
              }`}
          >
            <span className="block">Dummy Inc</span>
            <span className="block">Enterprise</span>
          </div>
        </div>

        <DashboardLinks isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      <div><SidebarProfile isSidebarCollapsed={isSidebarCollapsed} /></div>
    </nav>
  );
}





export default Sidebar;
