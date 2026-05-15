/**
 * data/transitionData.ts
 *
 * All static option lists used by the Create / Edit Transition forms.
 * Single source of truth — import from here, never hard-code in components.
 */

export const BUSINESS_UNITS = [
  "ICC",
  "MI",
  "ICS",
  "SPT",
  "PS",
  "BA ICE Sales",
  "FC",
  "BA DC Marketing",
  "CQP",
  "AI",
  "AS",
  "DCO",
  "FCO",
  "IF",
  "GT",
  "GroupCom",
] as const;

export const VERTICALS = [
  "Finance",
  "IT",
  "Engineering",
  "HR",
  "Procurement",
  "Supply Chain",
  "Quality",
  "R&D",
  "Legal",
] as const;

export const SSC_TYPES = ["TSSC", "CSSC", "ITSSC"] as const;

export const CAPACITY_TYPES = [
  "New Capacity",
  "Relocation from HQ",
  "Ramp-up",
  "Replacement",
] as const;

export const RESPONSIBLE_SSC_MEMBERS = [
  "Anis Mohanty",
  "Susanta Behra",
  "Abhishek Kumar",
  "Rupak Kumar",
  "Gaurav Mishra",
  "TBH",
] as const;

export const RESPONSIBLE_HQ_MEMBERS = [
  "Markus Weber",
  "Sarah Mitchell",
  "Andreas Klein",
  "Camille Laurent",
  "Giulia Romano",
  "Thomas Richter",
  "TBH",
] as const;

export const OVERALL_STATUSES = [
  "Yet to Start",
  "In Process",
  "Hold",
  "Cut Over",
] as const;

export const RAG_OPTIONS = ["Green", "Amber", "Red"] as const;

/** Steps shown in the StepIndicator */
export const CREATE_STEPS = [
  { id: "service", label: "Service Details" },
  { id: "capacity", label: "Capacity & Dates" },
  { id: "doi", label: "DOI Plan" },
  { id: "team", label: "Team" },
  { id: "review", label: "Review" },
] as const;

export type CreateStep = (typeof CREATE_STEPS)[number]["id"];
