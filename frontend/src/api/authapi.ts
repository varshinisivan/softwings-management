// src/api/authapi.ts
import api from "./api";

// ==================
// Interfaces
// ==================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    _id: string;   // ✅ FIXED
    name: string;
    email: string;
    role: string;
  };
}

// ==================
// Login
// ==================
export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/users/login", payload);

    if (response.data.token) {
      // ✅ Store token
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.user) {
      // ✅ Store user correctly
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Login failed. Please check your credentials.",
    };
  }
};

// ==================
// Register
// ==================
export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/users/register", payload);
    return response.data;
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Registration failed. Please try again.",
    };
  }
};

// ==================
// Logout
// ==================
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // ✅ added
};