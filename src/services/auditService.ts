/**
 * services/auditService.ts
 */

import { apiClient } from "./apiClient";
import type { AuditEntry } from "@/data/mock";

export async function getAuditLogs(entity?: string): Promise<AuditEntry[]> {
  const qs = entity ? `?entity=${entity}` : "";
  return apiClient.get<AuditEntry[]>(`/api/audit${qs}`);
}
