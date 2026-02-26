import api, { setAuthToken } from "./api";

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
  const response = await api.post<AuthResponse>("/users/login", payload);

  if (response.data.token) {
    // Store token and attach to all future requests
    localStorage.setItem("token", response.data.token);
    setAuthToken(response.data.token);
  }

  return response.data;
};

// ==================
// Register
// ==================
export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  // ✅ Attach token from localStorage automatically
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }

  const response = await api.post<AuthResponse>("/users/register", payload);
  return response.data;
};

// ==================
// Logout
// ==================
export const logout = (): void => {
  localStorage.removeItem("token");
  setAuthToken(null); // Remove Authorization header
};