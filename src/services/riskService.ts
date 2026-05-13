/**
 * services/riskService.ts
 */

import { apiClient } from "./apiClient";
import type { Risk } from "@/data/mock";

export async function getRisks(projectId?: string): Promise<Risk[]> {
  const qs = projectId ? `?projectId=${projectId}` : "";
  return apiClient.get<Risk[]>(`/api/risks${qs}`);
}

export async function createRisk(data: Partial<Risk>): Promise<Risk> {
  return apiClient.post<Risk>("/api/risks", data);
}

export async function updateRisk(
  id: string,
  data: Partial<Risk>
): Promise<void> {
  return apiClient.patch(`/api/risks/${id}`, data);
}

export async function closeRisk(id: string): Promise<void> {
  return apiClient.patch(`/api/risks/${id}/close`, {});
}
