/**
 * services/projectService.ts
 *
 * All project-related API calls.
 */

import { apiClient } from "./apiClient";
import type { Project } from "@/data/mock";

/** Fetch all projects (server filters by role automatically) */
export async function getProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>("/api/projects");
}

/** Fetch a single project with its work packages */
export async function getProject(id: string): Promise<Project> {
  return apiClient.get<Project>(`/api/projects/${id}`);
}

/** Create a new project */
export async function createProject(data: Partial<Project>): Promise<Project> {
  return apiClient.post<Project>("/api/projects", data);
}

/** Update project status / narrative */
export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  return apiClient.patch<Project>(`/api/projects/${id}`, data);
}

/** Update a single work package's progress + status */
export async function updateWorkPackage(
  projectId: string,
  wpId: string,
  data: { progress: number; status: string }
): Promise<void> {
  return apiClient.patch(`/api/projects/${projectId}/wp/${wpId}`, data);
}
