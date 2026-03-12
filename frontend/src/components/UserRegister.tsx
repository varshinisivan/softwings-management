// src/components/UserRegister.tsx
import { useState } from "react";
import { register } from "../api/authapi";
import InputField from "./form/input/InputField";
import Label from "./form/Label";
import Button from "./ui/button/Button"; // ✅ make sure this path exists

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const UserRegister = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as admin to register a user.");
        setLoading(false);
        return;
      }

      // ✅ pass only formData if register only accepts one argument
      const res = await register(formData); 

      if (res.success) {
        setMessage(`User ${formData.email} registered successfully!`);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "staff",
        });
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New User
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Register a new staff or admin account
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <Label>Name</Label>
            <InputField
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <InputField
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter secure password"
              required
            />
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Registering..." : "Register User"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserRegister;