/* eslint-disable @typescript-eslint/no-explicit-any */
import api, { setAuthToken } from "./api";

/**
 * Frontend-friendly User type
 */
export interface UserBase {
  _id: string;
  userId?: string;
  fullName: string;
  name?: string;        // optional alias for fullName
  email: string;
  role: string;
  userName?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type User = UserBase;

/**
 * API Response Types
 */
interface UsersResponse {
  success: boolean;
  users: User[];
}

interface UserResponse {
  success: boolean;
  user: User;
}

/**
 * Helper: Attach token automatically
 */
const attachToken = () => {
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);
};

/**
 * Get all users (Admin / Manager)
 */
export const getAllUsers = async (): Promise<User[]> => {
  attachToken();
  const response = await api.get<UsersResponse>("/users");
  return response.data.users;
};

/**
 * Get single user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  attachToken();
  const response = await api.get<UserResponse>(`/users/${id}`);
  return response.data.user;
};

/**
 * Get logged-in user profile
 */
export const getUserProfile = async (): Promise<User> => {
  attachToken();
  const response = await api.get<UserResponse>("/users/profile");
  return response.data.user;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  attachToken();
  const response = await api.put<UserResponse>(`/users/${id}`, data);
  return response.data.user;
};

/**
 * Delete / Deactivate user
 */
export const deleteUser = async (id: string): Promise<void> => {
  attachToken();
  await api.delete(`/users/${id}`);
};