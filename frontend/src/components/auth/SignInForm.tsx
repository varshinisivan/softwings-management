/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { login } from "../../api/authapi";

interface LoginFormState {
  email: string;
  password: string;
}

export default function SignInForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ Clear error on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrorMessage(""); // 🔥 FIX: remove old error

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔥 FIX: prevent multiple API calls
    if (loading) return;

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      console.log("Login response:", response); // optional debug

      if (response.success) {
        // 🔥 FIX: clear error before redirect
        setErrorMessage("");

        // ✅ Redirect to dashboard/home
        navigate("/", { replace: true });
      } else {
        setErrorMessage(response.message || "Login failed.");
      }
    } catch (error: any) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 text-center">
        Sign In
      </h1>

      {/* ✅ Error Message */}
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeCloseIcon className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>
        </div>

        {/* Button */}
        <Button
          type="submit"
          className="w-full"
          size="sm"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

      </form>
    </div>
  );
}