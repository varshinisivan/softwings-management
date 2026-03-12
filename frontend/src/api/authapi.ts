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
    id: string;
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
    // ✅ Make sure API uses the environment variable for backend
    const response = await api.post<AuthResponse>("/users/login", payload);

    if (response.data.token) {
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (err: any) {
    // Return a consistent AuthResponse even on error
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
};