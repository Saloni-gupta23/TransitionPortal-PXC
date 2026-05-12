export type Role =
  | "GLOBAL_BOARD"
  | "SSC_HEAD"
  | "TRANSITION_OWNER"
  | "TRANSITION_SUPPORT"
  | "TSSC_LEAD"
  | "CSSC_LEAD"
  | "ITSSC_LEAD"
  | "VIEWER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}

export const USERS: User[] = [
  { id: "u1", name: "Hanna Albrecht", email: "hanna.albrecht@phoenixcontact.com", role: "GLOBAL_BOARD", initials: "HA" },
  { id: "u2", name: "Peter Karaski", email: "peter.karaski@phoenixcontact.com", role: "GLOBAL_BOARD", initials: "PK" },
  { id: "u3", name: "Gaurav Mishra", email: "gaurav.mishra@phoenixcontact.com", role: "SSC_HEAD", initials: "GM" },
  { id: "u4", name: "Anis Mohanty", email: "anis.mohanty@phoenixcontact.com", role: "TRANSITION_OWNER", initials: "AM" },
  { id: "u5", name: "Susanta Behra", email: "susanta.behra@phoenixcontact.com", role: "TRANSITION_SUPPORT", initials: "SB" },
  { id: "u6", name: "Abhishek Kumar", email: "abhishek.kumar@phoenixcontact.com", role: "TSSC_LEAD", initials: "AK" },
  { id: "u7", name: "Rupak Kumar", email: "rupak.kumar@phoenixcontact.com", role: "ITSSC_LEAD", initials: "RK" },
  { id: "u8", name: "Lena Becker", email: "lena.becker@phoenixcontact.com", role: "VIEWER", initials: "LB" },
];

export const ROLE_LABEL: Record<Role, string> = {
  GLOBAL_BOARD: "Global SSC Board",
  SSC_HEAD: "SSC India Head",
  TRANSITION_OWNER: "Transition Owner",
  TRANSITION_SUPPORT: "Transition Support",
  TSSC_LEAD: "TSSC Lead",
  CSSC_LEAD: "CSSC Lead",
  ITSSC_LEAD: "ITSSC Lead",
  VIEWER: "Stakeholder Viewer",
};

export type SSCType = "TSSC" | "CSSC" | "ITSSC";
export type OverallStatus = "Yet to Start" | "In Process" | "Hold" | "Cut Over";
export type RAG = "Red" | "Amber" | "Green";
export type CapacityType = "New Capacity" | "Relocation from HQ" | "Ramp-up" | "Replacement";

export interface WorkPackageProgress {
  name: string;
  start: number; // month index 0..11
  end: number;
  progress: number; // 0..100
  status: "red" | "amber" | "green" | "white";
}

export interface Project {
  id: string;
  unit: string;
  vertical: string;
  serviceArea: string;
  jobPosition: string;
  sscType: SSCType;
  requiredFTE: number;
  capacityType: CapacityType;
  overallStatus: OverallStatus;
  currentDOI: number; // 1..5
  rag: RAG;
  plannedStart: string;
  cutoverDate: string;
  hypercareStart: string;
  hypercareEnd: string;
  ownerId: string;
  supportId: string;
  responsibleSSC: string;
  responsibleHQ: string;
  lastUpdated: string;
  workPackages: WorkPackageProgress[];
  results: string[];
  nextSteps: string[];
  criticalPoints: string[];
}

const wp = (name: string, start: number, end: number, progress: number, status: WorkPackageProgress["status"]): WorkPackageProgress =>
  ({ name, start, end, progress, status });

export const PROJECTS: Project[] = [
  {
    id: "PRJ-001",
    unit: "PxC DE",
    vertical: "Finance",
    serviceArea: "Accounts Payable",
    jobPosition: "AP Specialist",
    sscType: "CSSC",
    requiredFTE: 4,
    capacityType: "Relocation from HQ",
    overallStatus: "In Process",
    currentDOI: 4,
    rag: "Green",
    plannedStart: "2025-02-15",
    cutoverDate: "2025-08-30",
    hypercareStart: "2025-09-01",
    hypercareEnd: "2025-11-30",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Anis Mohanty",
    responsibleHQ: "Markus Weber",
    lastUpdated: "2026-05-08",
    workPackages: [
      wp("Strategic Planning", 0, 1, 100, "green"),
      wp("Budget", 1, 2, 100, "green"),
      wp("Operative Planning", 2, 3, 100, "green"),
      wp("Recruiting", 3, 5, 90, "green"),
      wp("Training Material, IT & Space", 4, 6, 75, "amber"),
      wp("Process & Documentation", 4, 7, 60, "amber"),
      wp("Onboarding / Knowledge Transfer", 6, 8, 40, "green"),
      wp("Cut-over", 8, 9, 0, "white"),
      wp("Hypercare / Stabilization", 9, 11, 0, "white"),
      wp("Monitoring", 10, 11, 0, "white"),
    ],
    results: ["Recruitment closed for 4 AP Specialists", "Training environment provisioned by IT"],
    nextSteps: ["Finalize SOP review with HQ Finance", "Begin shadow training in week 26"],
    criticalPoints: ["Awaiting HQ sign-off on chart of accounts mapping"],
  },
  {
    id: "PRJ-002",
    unit: "PxC USA",
    vertical: "IT",
    serviceArea: "Service Desk",
    jobPosition: "L1 Support Engineer",
    sscType: "ITSSC",
    requiredFTE: 6,
    capacityType: "New Capacity",
    overallStatus: "In Process",
    currentDOI: 3,
    rag: "Amber",
    plannedStart: "2025-04-01",
    cutoverDate: "2025-10-15",
    hypercareStart: "2025-10-20",
    hypercareEnd: "2026-01-20",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Rupak Kumar",
    responsibleHQ: "Sarah Mitchell",
    lastUpdated: "2026-05-10",
    workPackages: [
      wp("Strategic Planning", 0, 1, 100, "green"),
      wp("Budget", 1, 2, 100, "green"),
      wp("Operative Planning", 2, 4, 80, "amber"),
      wp("Recruiting", 3, 6, 50, "amber"),
      wp("Training Material, IT & Space", 5, 7, 30, "amber"),
      wp("Process & Documentation", 5, 8, 20, "red"),
      wp("Onboarding / Knowledge Transfer", 7, 9, 0, "white"),
      wp("Cut-over", 9, 10, 0, "white"),
      wp("Hypercare / Stabilization", 10, 11, 0, "white"),
      wp("Monitoring", 11, 11, 0, "white"),
    ],
    results: ["Job descriptions approved", "Tooling licenses procured"],
    nextSteps: ["Accelerate recruiting pipeline", "Complete process documentation v1"],
    criticalPoints: ["Documentation delays risk cut-over slip by 2 weeks"],
  },
  {
    id: "PRJ-003",
    unit: "PxC DE",
    vertical: "Engineering",
    serviceArea: "Technical Documentation",
    jobPosition: "Technical Writer",
    sscType: "TSSC",
    requiredFTE: 3,
    capacityType: "Ramp-up",
    overallStatus: "Cut Over",
    currentDOI: 5,
    rag: "Green",
    plannedStart: "2024-08-01",
    cutoverDate: "2025-02-28",
    hypercareStart: "2025-03-01",
    hypercareEnd: "2025-05-31",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Abhishek Kumar",
    responsibleHQ: "Andreas Klein",
    lastUpdated: "2026-04-22",
    workPackages: [
      wp("Strategic Planning", 0, 1, 100, "green"),
      wp("Budget", 1, 2, 100, "green"),
      wp("Operative Planning", 2, 3, 100, "green"),
      wp("Recruiting", 2, 4, 100, "green"),
      wp("Training Material, IT & Space", 3, 5, 100, "green"),
      wp("Process & Documentation", 4, 6, 100, "green"),
      wp("Onboarding / Knowledge Transfer", 5, 7, 100, "green"),
      wp("Cut-over", 7, 8, 100, "green"),
      wp("Hypercare / Stabilization", 8, 10, 100, "green"),
      wp("Monitoring", 10, 11, 100, "green"),
    ],
    results: ["Hypercare closed without P1 incidents"],
    nextSteps: ["Move into steady state monitoring"],
    criticalPoints: [],
  },
  {
    id: "PRJ-004",
    unit: "PxC FR",
    vertical: "HR",
    serviceArea: "Payroll",
    jobPosition: "Payroll Analyst",
    sscType: "CSSC",
    requiredFTE: 2,
    capacityType: "Replacement",
    overallStatus: "Hold",
    currentDOI: 2,
    rag: "Red",
    plannedStart: "2025-06-01",
    cutoverDate: "2025-12-15",
    hypercareStart: "2026-01-01",
    hypercareEnd: "2026-03-31",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Anis Mohanty",
    responsibleHQ: "Camille Laurent",
    lastUpdated: "2026-05-01",
    workPackages: [
      wp("Strategic Planning", 0, 1, 100, "green"),
      wp("Budget", 1, 2, 60, "red"),
      wp("Operative Planning", 2, 3, 0, "white"),
      wp("Recruiting", 3, 5, 0, "white"),
      wp("Training Material, IT & Space", 4, 6, 0, "white"),
      wp("Process & Documentation", 4, 7, 0, "white"),
      wp("Onboarding / Knowledge Transfer", 6, 8, 0, "white"),
      wp("Cut-over", 8, 9, 0, "white"),
      wp("Hypercare / Stabilization", 9, 11, 0, "white"),
      wp("Monitoring", 10, 11, 0, "white"),
    ],
    results: ["Project on hold pending budget approval"],
    nextSteps: ["Re-engage Global SSC Board for budget exception"],
    criticalPoints: ["Budget shortfall of EUR 120k blocking progress"],
  },
  {
    id: "PRJ-005",
    unit: "PxC IT",
    vertical: "Procurement",
    serviceArea: "Indirect Procurement",
    jobPosition: "Procurement Officer",
    sscType: "CSSC",
    requiredFTE: 3,
    capacityType: "New Capacity",
    overallStatus: "Yet to Start",
    currentDOI: 1,
    rag: "Green",
    plannedStart: "2026-07-01",
    cutoverDate: "2027-01-31",
    hypercareStart: "2027-02-01",
    hypercareEnd: "2027-04-30",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Anis Mohanty",
    responsibleHQ: "Giulia Romano",
    lastUpdated: "2026-05-09",
    workPackages: [
      wp("Strategic Planning", 0, 2, 30, "green"),
      wp("Budget", 1, 3, 0, "white"),
      wp("Operative Planning", 2, 4, 0, "white"),
      wp("Recruiting", 3, 5, 0, "white"),
      wp("Training Material, IT & Space", 4, 6, 0, "white"),
      wp("Process & Documentation", 4, 7, 0, "white"),
      wp("Onboarding / Knowledge Transfer", 6, 8, 0, "white"),
      wp("Cut-over", 8, 9, 0, "white"),
      wp("Hypercare / Stabilization", 9, 11, 0, "white"),
      wp("Monitoring", 10, 11, 0, "white"),
    ],
    results: ["Initial scoping workshop completed"],
    nextSteps: ["Build business case for budget submission"],
    criticalPoints: [],
  },
  {
    id: "PRJ-006",
    unit: "PxC DE",
    vertical: "Engineering",
    serviceArea: "CAD Support",
    jobPosition: "CAD Engineer",
    sscType: "TSSC",
    requiredFTE: 5,
    capacityType: "Ramp-up",
    overallStatus: "In Process",
    currentDOI: 4,
    rag: "Green",
    plannedStart: "2025-03-15",
    cutoverDate: "2025-09-30",
    hypercareStart: "2025-10-01",
    hypercareEnd: "2025-12-31",
    ownerId: "u4",
    supportId: "u5",
    responsibleSSC: "Abhishek Kumar",
    responsibleHQ: "Thomas Richter",
    lastUpdated: "2026-05-11",
    workPackages: [
      wp("Strategic Planning", 0, 1, 100, "green"),
      wp("Budget", 1, 2, 100, "green"),
      wp("Operative Planning", 2, 3, 100, "green"),
      wp("Recruiting", 3, 5, 100, "green"),
      wp("Training Material, IT & Space", 4, 6, 90, "green"),
      wp("Process & Documentation", 4, 7, 70, "amber"),
      wp("Onboarding / Knowledge Transfer", 6, 8, 50, "green"),
      wp("Cut-over", 8, 9, 0, "white"),
      wp("Hypercare / Stabilization", 9, 11, 0, "white"),
      wp("Monitoring", 10, 11, 0, "white"),
    ],
    results: ["Knowledge transfer 50% complete"],
    nextSteps: ["Finalize SOP packages for Module B"],
    criticalPoints: [],
  },
];

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  probability: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  severity: "Low" | "Medium" | "High" | "Critical";
  mitigation: string;
  ownerId: string;
  dueDate: string;
  status: "Open" | "Mitigating" | "Closed";
}

export const RISKS: Risk[] = [
  { id: "R-101", projectId: "PRJ-002", title: "Process documentation delay", description: "SOP coverage below plan", probability: "High", impact: "High", severity: "Critical", mitigation: "Add 2 documentation contractors", ownerId: "u4", dueDate: "2026-06-15", status: "Mitigating" },
  { id: "R-102", projectId: "PRJ-004", title: "Budget approval pending", description: "Awaiting Global SSC Board", probability: "High", impact: "High", severity: "Critical", mitigation: "Escalate to Hanna Albrecht", ownerId: "u3", dueDate: "2026-05-30", status: "Open" },
  { id: "R-103", projectId: "PRJ-001", title: "Chart of accounts mapping", description: "HQ sign-off pending", probability: "Medium", impact: "Medium", severity: "Medium", mitigation: "Workshop scheduled", ownerId: "u4", dueDate: "2026-06-01", status: "Open" },
  { id: "R-104", projectId: "PRJ-006", title: "SOP review capacity", description: "Reviewer bandwidth limited", probability: "Medium", impact: "Low", severity: "Low", mitigation: "Realign reviewer roster", ownerId: "u5", dueDate: "2026-06-20", status: "Open" },
];

export interface AuditEntry {
  id: string;
  ts: string;
  user: string;
  entity: string;
  action: string;
  before?: string;
  after?: string;
  comment?: string;
}

export const AUDIT: AuditEntry[] = [
  { id: "A1", ts: "2026-05-11 09:21", user: "Anis Mohanty", entity: "PRJ-002", action: "Updated DOI", before: "Stage 2", after: "Stage 3" },
  { id: "A2", ts: "2026-05-10 17:02", user: "Susanta Behra", entity: "PRJ-001", action: "Added evidence", after: "training-plan-v3.pdf" },
  { id: "A3", ts: "2026-05-09 11:48", user: "Gaurav Mishra", entity: "PRJ-004", action: "Approval requested", comment: "Budget exception" },
  { id: "A4", ts: "2026-05-08 14:30", user: "Hanna Albrecht", entity: "PRJ-003", action: "Closed Hypercare" },
];

export const KPI_LABELS: Record<OverallStatus, string> = {
  "Yet to Start": "Yet to Start",
  "In Process": "In Process",
  "Hold": "Hold",
  "Cut Over": "Cut Over",
};
