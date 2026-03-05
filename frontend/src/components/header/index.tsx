import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserType {
  name: string;
  email: string;
}

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  // Get logged in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        
        {/* Left Side - Logo or Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Dashboard
          </h2>
        </div>

        {/* Right Side - User Section */}
        <div className="flex items-center gap-6">

          <div className="relative">
            
            {/* Profile Click Area */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/images/user/user-01.png"
                alt="profile"
                className="h-10 w-10 rounded-full"
              />

              <span className="hidden sm:block font-medium text-black dark:text-white">
                {user?.name || "User"}
              </span>
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 rounded-md bg-white shadow-lg border border-stroke dark:border-strokedark dark:bg-boxdark z-50">
                
                <ul className="py-2 text-sm text-black dark:text-white">

                  <li
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Edit Profile
                  </li>

                  <li
                    onClick={() => navigate("/settings")}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Account Settings
                  </li>

                  <li
                    onClick={() => navigate("/support")}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Support
                  </li>

                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 cursor-pointer"
                  >
                    Sign Out
                  </li>

                </ul>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;