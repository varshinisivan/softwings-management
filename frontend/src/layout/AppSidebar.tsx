import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GridIcon,
  PieChartIcon,
  UserCircleIcon,
  CalenderIcon,
  ChevronDownIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  {
    name: "User Management",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "User Register", path: "/user-register" },
      { name: "All Users", path: "/all-users" },
    ],
  },
  {
    name: "Client Management",
    icon: <GridIcon />,
    subItems: [
      { name: "Add Client", path: "/clients/add" },
      { name: "All Clients", path: "/clients" },
    ],
  },
  { name: "Renewal Reminder", icon: <CalenderIcon />, path: "/renewals" },
  { name: "Profit Report", icon: <PieChartIcon />, path: "/profit-report" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isHovered, setIsHovered, isMobileOpen } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  useEffect(() => {
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) setOpenSubmenu({ index });
      });
    });
  }, [location.pathname]);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  openSubmenu?.index === index
                    ? "bg-blue-50 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 flex-1 font-medium text-gray-800 dark:text-white">
                    {nav.name}
                  </span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-auto transition-transform ${
                      openSubmenu?.index === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {openSubmenu?.index === index && (
                <ul className="ml-8 mt-1 flex flex-col gap-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path}
                        className={`block p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive(sub.path)
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-300"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link
              to={nav.path!}
              className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                isActive(nav.path!)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-lg">{nav.icon}</span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="ml-3 flex-1 font-medium">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 ${
        isExpanded || isHovered || isMobileOpen ? "w-64" : "w-20"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="py-6 px-4 flex items-center justify-center">
        <Link to="/">
          <img
            src="/images/logo/softwings-logo.png"
            alt="Logo"
            className="w-20 lg:w-32 transition-all"
          />
        </Link>
      </div>

      {/* Menu */}
      <div className="px-4 overflow-y-auto flex-1">
        {renderMenuItems(navItems)}
      </div>
    </aside>
  );
};

export default AppSidebar;