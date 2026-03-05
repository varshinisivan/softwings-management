/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

/**
 * Frontend-friendly User type
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Normalize user object (VERY IMPORTANT)
 */
const normalizeUser = (user: any): User => ({
  _id: user._id || user.id, // guarantee _id exists
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");

  return response.data.users.map((user: any) =>
    normalizeUser(user)
  );
};

/**
 * Get single user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return normalizeUser(response.data.user);
};

/**
 * Get logged-in user profile
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get("/users/profile");
  return normalizeUser(response.data.user);
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return normalizeUser(response.data.user);
};

/**
 * Delete / Deactivate user
 */
export const deleteUser = async (id: string): Promise<void> => {
  if (!id) throw new Error("Invalid user ID");
  await api.delete(`/users/${id}`);
};