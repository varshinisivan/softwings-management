// src/pages/AllUsers.tsx
import { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateUser, deleteUser } from "../api/userapi";
import { logout } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

interface User {
  _id: string;
  fullName?: string;
  name?: string;
  email: string;
  role: string;
  isActive: boolean;
}

const USERS_PER_PAGE = 5;

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // ================= AUTH ERROR =================
  const handleAuthError = useCallback(() => {
    alert("Session expired. Please login again.");
    logout();
    navigate("/login");
  }, [navigate]);

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async () => {
    try {
      const res: any[] = await getAllUsers(); // ✅ cast as any[]

      if (!Array.isArray(res)) {
        console.error("Users response is not array:", res);
        return;
      }

      // Normalize _id and ensure isActive boolean
      const normalizedUsers: User[] = res.map((u: any) => ({
        ...u,
        _id: u._id || "",
        name: u.name || u.fullName || "",
        isActive: u.isActive ?? false,
      }));

      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers);
    } catch (err: any) {
      if ([401, 403].includes(err.response?.status)) {
        handleAuthError();
      } else {
        alert("Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= INLINE EDIT =================
  const startEditing = (user: User) => {
    if (!user._id) return;
    setEditingUserId(user._id);
    setEditForm({
      ...user,
      name: user.name || user.fullName,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "isActive"
        ? e.target.value === "true"
        : e.target.value;

    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const saveEdit = async (id: string) => {
    if (!id) return;
    try {
      const payload = {
        ...editForm,
        fullName: editForm.name,
      };
      delete payload._id;

      const updatedUser = await updateUser(id, payload);

      const safeUser: User = {
        ...updatedUser,
        isActive: updatedUser.isActive ?? false,
      };

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? safeUser : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === id ? safeUser : u))
      );

      cancelEditing();
      alert("User updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // ================= DELETE =================
  const deleteUserHandler = async (id: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev
          .filter((u) => u._id !== id)
          .map((u) => ({ ...u, isActive: u.isActive ?? false }))
      );
      setFilteredUsers((prev) =>
        prev
          .filter((u) => u._id !== id)
          .map((u) => ({ ...u, isActive: u.isActive ?? false }))
      );

      alert("User deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ================= SEARCH =================
  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = users.filter((u) =>
      (u.name || u.fullName || "")
        .toLowerCase()
        .includes(text.toLowerCase())
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          User Management
        </h1>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id || Math.random()} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <input
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleInputChange}
                        className="border px-3 py-1 rounded-lg w-full"
                      />
                    ) : (
                      user.name || user.fullName
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <input
                        name="email"
                        value={editForm.email || ""}
                        onChange={handleInputChange}
                        className="border px-3 py-1 rounded-lg w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleInputChange}
                        className="border px-3 py-1 rounded-lg"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <select
                        name="isActive"
                        value={String(editForm.isActive)}
                        onChange={handleInputChange}
                        className="border px-3 py-1 rounded-lg"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 flex justify-center gap-3">
                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(user._id)}
                          className="px-4 py-1 bg-green-500 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-1 bg-gray-400 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(user)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteUserHandler(user._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;