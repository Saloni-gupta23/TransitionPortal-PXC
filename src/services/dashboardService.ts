/**
 * services/dashboardService.ts
 */

import { apiClient } from "./apiClient";

export interface DashboardStats {
  totals: { total_projects: number; total_fte: number };
  statusCounts: Array<{ overall_status: string; count: number; fte: number }>;
  sscDist: Array<{ ssc_type: string; count: number }>;
  criticalRisks: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>("/api/dashboard/stats");
}
