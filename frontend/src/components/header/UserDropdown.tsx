import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role: string;
}

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    name: "User",
    email: "No Email",
    role: "Admin",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Sign Out
  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    navigate("/signin"); // change if your login route different
  };

  return (
    <div className="relative flex items-center gap-2">
      
      {/* PROFILE BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {/* PROFILE CIRCLE */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <span className="font-medium text-gray-800 dark:text-white">
          {user.name}
        </span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">

          {/* USER INFO */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-blue-600">{user.role}</p>
          </div>

          {/* MENU */}
          <div className="flex flex-col">

            <Link
              to="/edit-profile"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Edit Profile
            </Link>

            <Link
              to="/account-settings"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Account Settings
            </Link>

            <Link
              to="/support"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Support
            </Link>

          </div>

          {/* SIGN OUT */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserDropdown;