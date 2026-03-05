import { useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-between w-full lg:flex-row lg:px-6">
        
        {/* Left: Sidebar toggle + Logo */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 lg:justify-start lg:gap-4 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg dark:text-gray-400 lg:h-11 lg:w-11 lg:border lg:border-gray-200 dark:border-gray-800"
            onClick={handleToggle}
          >
            {isMobileOpen ? <span>✖</span> : <span>☰</span>}
          </button>

          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Right: User Dropdown Only */}
        <div className="flex items-center gap-4 lg:justify-end lg:px-0">
          <UserDropdown />
        </div>

      </div>
    </header>
  );
};

export default AppHeader;