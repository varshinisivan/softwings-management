import { useState } from "react";
import { register } from "../api/authapi";
import InputField from "../components/form/input/InputField";
import Button from "../components/ui/Button/Button";
import Label from "../components/form/Label";

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
  const [message, setMessage] = useState(""); // success or error message

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
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as admin to register a user.");
        setLoading(false);
        return;
      }

      // ✅ Pass token to the register function
      const res = await register(formData, token);

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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Register</h1>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Name</Label>
          <InputField
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <InputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div>
          <Label>Role</Label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default UserRegister;