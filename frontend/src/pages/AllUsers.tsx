// src/pages/AllUsers.tsx
import { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateUser, deleteUser } from "../api/userapi";
import { logout } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const navigate = useNavigate();

  // =========================
  // Handle expired or invalid token
  // =========================
  const handleAuthError = useCallback(() => {
    alert("Session expired. Please login again.");
    logout();
    navigate("/login");
  }, [navigate]);

  // =========================
  // Fetch all users
  // =========================
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);

      const res = await getAllUsers();
      setUsers(res);
    } catch (err: any) {
      if ([401, 403].includes(err.response?.status)) handleAuthError();
      else setError(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // =========================
  // Start editing a user
  // =========================
  const startEditing = (user: User) => {
    setEditingUserId(user._id);
    setEditForm({ ...user });
  };

  // =========================
  // Cancel editing
  // =========================
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  // =========================
  // Handle input changes
  // =========================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // =========================
  // Save edits
  // =========================
  const saveEdit = async (id: string) => {
    try {
      const updatedUser = await updateUser(id, editForm);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user))
      );
      cancelEditing();
    } catch (err: any) {
      if ([401, 403].includes(err.response?.status)) handleAuthError();
      else alert(err.response?.data?.message || "Failed to update user");
    }
  };

  // =========================
  // Deactivate user
  // =========================
  const deactivateUserHandler = async (id: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    try {
      await updateUser(id, { isActive: false });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: false } : user
        )
      );
    } catch (err: any) {
      if ([401, 403].includes(err.response?.status)) handleAuthError();
      else alert(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  // =========================
  // Soft delete user
  // =========================
  const deleteUserHandler = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id); // backend soft delete
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err: any) {
      if ([401, 403].includes(err.response?.status)) handleAuthError();
      else alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Status</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={!user.isActive ? "bg-red-50" : ""}>
                  <td className="border p-3">
                    {editingUserId === user._id ? (
                      <input
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="border p-3">
                    {editingUserId === user._id ? (
                      <input
                        name="email"
                        value={editForm.email || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border p-3 capitalize">
                    {editingUserId === user._id ? (
                      <select
                        name="role"
                        value={editForm.role || "staff"}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="border p-3">
                    {editingUserId === user._id ? (
                      <select
                        name="isActive"
                        value={editForm.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            isActive: e.target.value === "true",
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user.isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    {editingUserId === user._id ? (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => saveEdit(user._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => startEditing(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          onClick={() => deactivateUserHandler(user._id)}
                        >
                          Deactivate
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => deleteUserHandler(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;