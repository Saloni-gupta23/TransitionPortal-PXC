/**
 * data/doiData.ts
 *
 * All DOI stage definitions — workflows, labels, colours, navigation order.
 * Single source of truth. Controllers and views import from here.
 */

export type WorkflowStatus = "pending" | "complete";

export interface Workflow {
  id: number;
  label: string;
}

export interface DOIStage {
  /** 1-based DOI index */
  stage: number;
  key: string;
  title: string;
  subtitle: string;
  /** accent colour token from your design system */
  accent: "brand" | "teal" | "warning" | "danger" | "success";
  workflows: Workflow[];
  /** route key for the next stage, or null if last */
  nextStage: string | null;
  prevStage: string | null;
}

export const DOI_STAGES: DOIStage[] = [
  {
    stage: 1,
    key: "strategic-planning",
    title: "Strategic Planning",
    subtitle:
      "Service identification, potential & process analyses, SSC Masterplan, Service Profile",
    accent: "brand",
    workflows: [
      {
        id: 1,
        label:
          "Service demand defined, described and integrated into 5Y plan of SSC.",
      },
    ],
    nextStage: "budget",
    prevStage: null,
  },
  {
    stage: 2,
    key: "budget",
    title: "Budget",
    subtitle:
      "Release of service implementation — budget confirmation and resource allocation",
    accent: "teal",
    workflows: [
      { id: 1, label: "Service profile is available." },
      { id: 2, label: "SSC location and vertical are defined." },
      {
        id: 3,
        label:
          "Service volumes (= charging volume / costs) and cost avoidance are evaluated.",
      },
      {
        id: 4,
        label:
          "HQ unit confirmed the absorption of the expected relevant costs (charging costs).",
      },
      { id: 5, label: "Responsible at HQ unit and TSSC are defined." },
      {
        id: 6,
        label: "Communication to the respective location is completed.",
      },
    ],
    nextStage: "operative-planning",
    prevStage: "strategic-planning",
  },
  {
    stage: 3,
    key: "operative-planning",
    title: "Operative Planning",
    subtitle:
      "Kick-off of transitions with SSC locations · Creation of job descriptions · Recruitment release",
    accent: "warning",
    workflows: [
      {
        id: 1,
        label: "Transition team is in place and kick-off has been conducted.",
      },
      {
        id: 2,
        label:
          "Milestone plan is available (incl. process description, training plan, knowledge transfer, test phase, communication concept).",
      },
      {
        id: 3,
        label:
          "Recruiting plan & cost estimate (for recruitment) based on service profiles / job descriptions are available.",
      },
      { id: 4, label: "Charging rate re-calculated based on job description." },
      {
        id: 5,
        label:
          "The unit re-confirmed the absorption of the estimated, relevant costs (charging costs).",
      },
      {
        id: 6,
        label: "Release of recruitment is completed (by Global TSSC Head).",
      },
    ],
    nextStage: "execution",
    prevStage: "budget",
  },
  {
    stage: 4,
    key: "execution",
    title: "Execution",
    subtitle:
      "Recruiting · Training · Knowledge transfer · Onboarding · Cut-over · Hypercare · Stabilisation",
    accent: "danger",
    workflows: [
      { id: 1, label: "Recruitment completed." },
      {
        id: 2,
        label: "Training material, IT systems and workspace are prepared.",
      },
      { id: 3, label: "Process & documentation packages are finalised." },
      { id: 4, label: "Onboarding / knowledge transfer sessions completed." },
      { id: 5, label: "Cut-over completed and signed off by HQ stakeholder." },
      { id: 6, label: "Hypercare period concluded without P1 incidents." },
      { id: 7, label: "Stabilisation confirmed by both SSC and HQ leads." },
    ],
    nextStage: "monitoring",
    prevStage: "operative-planning",
  },
  {
    stage: 5,
    key: "monitoring",
    title: "Monitoring",
    subtitle:
      "Tracking service effectivity & continuous improvement — steady state operations",
    accent: "success",
    workflows: [
      { id: 1, label: "Services are P&L effective." },
      { id: 2, label: "Monitoring of service effectivity is implemented." },
    ],
    nextStage: null,
    prevStage: "execution",
  },
];

export function getStageByKey(key: string): DOIStage | undefined {
  return DOI_STAGES.find((s) => s.key === key);
}

export const STAGE_ACCENT_COLORS: Record<DOIStage["accent"], string> = {
  brand: "bg-brand text-brand-foreground",
  teal: "bg-teal text-white",
  warning: "bg-rag-amber text-black",
  danger: "bg-rag-red text-white",
  success: "bg-rag-green text-white",
};

export const STAGE_SOFT_COLORS: Record<DOIStage["accent"], string> = {
  brand: "bg-brand-soft text-brand-deep border-brand/20",
  teal: "bg-teal-soft text-teal-deep border-teal/20",
  warning:
    "bg-rag-amber/10 text-yellow-800 border-rag-amber/30 dark:text-yellow-300",
  danger: "bg-rag-red/10 text-rag-red border-rag-red/20",
  success:
    "bg-rag-green/10 text-emerald-700 border-rag-green/20 dark:text-emerald-400",
};

export const STAGE_GRADIENT: Record<DOIStage["accent"], string> = {
  brand: "from-brand to-brand-deep",
  teal: "from-teal to-teal-deep",
  warning: "from-rag-amber to-amber-500",
  danger: "from-rag-red to-red-700",
  success: "from-rag-green to-emerald-600",
};
