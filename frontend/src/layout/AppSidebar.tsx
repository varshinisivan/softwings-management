import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Icons
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

// ---------------- NAV ITEMS ----------------

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
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
  {
    name: "Renewal Reminder",
    icon: <CalenderIcon />,
    path: "/renewals",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin" },
      { name: "Sign Up", path: "/signup" },
    ],
  },
];

// ---------------- SIDEBAR ----------------

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSubmenuToggle = (index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === type && prev.index === index) {
        return null;
      }
      return { type, index };
    });
  };

  // Auto open submenu if child route active
  useEffect(() => {
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;

      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((sub) => {
            if (isActive(sub.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
            }
          });
        }
      });
    });
  }, [location.pathname]);

  const renderMenuItems = (items: NavItem[], type: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, type)}
                className={`menu-item group ${
                  openSubmenu?.type === type &&
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform ${
                      openSubmenu?.type === type &&
                      openSubmenu?.index === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                )}
              </button>

              {openSubmenu?.type === type &&
                openSubmenu?.index === index && (
                  <ul className="ml-8 mt-2 flex flex-col gap-2">
                    {nav.subItems.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          to={sub.path}
                          className={`block text-sm ${
                            isActive(sub.path)
                              ? "text-brand-600 font-medium"
                              : "text-gray-500 hover:text-brand-500"
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
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 transition-all duration-300 z-50 ${
        isExpanded || isMobileOpen || isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 px-5">
        <Link to="/">
          <img src="/images/logo/logo.svg" alt="Logo" width={150} />
        </Link>
      </div>

      <div className="px-5 overflow-y-auto">
        <h2 className="mb-4 text-xs uppercase text-gray-400">Menu</h2>
        {renderMenuItems(navItems, "main")}

        <div className="mt-6">
          <h2 className="mb-4 text-xs uppercase text-gray-400">Others</h2>
          {renderMenuItems(othersItems, "others")}
        </div>

        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;