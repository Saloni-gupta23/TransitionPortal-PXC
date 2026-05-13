/**
 * services/userService.ts
 */

import { apiClient } from "./apiClient";
import type { User } from "@/data/mock";

export async function getUsers(): Promise<User[]> {
  return apiClient.get<User[]>("/api/users");
}

export async function getUser(id: string): Promise<User> {
  return apiClient.get<User>(`/api/users/${id}`);
}

export async function inviteUser(data: {
  name: string;
  email: string;
  role: string;
  initials: string;
  temporaryPassword?: string;
}): Promise<User> {
  return apiClient.post<User>("/api/users", data);
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  return apiClient.patch<User>(`/api/users/${id}`, data);
}

export async function deactivateUser(id: string): Promise<void> {
  return apiClient.delete(`/api/users/${id}`);
}
