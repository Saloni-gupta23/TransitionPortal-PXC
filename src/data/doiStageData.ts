/**
 * data/doiStageData.ts
 *
 * Extended DOI stage data — per-stage work packages with descriptions,
 * date tracking keys, and navigation metadata.
 *
 * This is the single source of truth for what appears on each DOI stage page.
 * Each stage has:
 *   - workPackages: checklist items shown on that stage's page
 *   - pageTitle / pageSubtitle: for the stage detail page header
 *   - nextRoute / prevRoute: for Back / Submit & Continue navigation
 */

export interface StageWorkPackage {
  id: number;
  label: string;
  description: string;
}

export interface DOIStagePageData {
  stageKey: string;
  stageNumber: number;
  pageTitle: string;
  pageSubtitle: string;
  /** Storage key suffix for localStorage */
  storageKeySuffix: string;
  workPackages: StageWorkPackage[];
  /** Route key of the next stage, null if last */
  nextRoute: string | null;
  /** Route key of the prev stage, null if first */
  prevRoute: string | null;
  /** Redirect target after final stage submit */
  finalRedirect?: string;
}

export const DOI_STAGE_PAGES: DOIStagePageData[] = [
  {
    stageKey: "strategic-planning",
    stageNumber: 1,
    pageTitle: "Strategic Planning",
    pageSubtitle:
      "Service identification, potential & process analyses, SSC Masterplan, Service Profile",
    storageKeySuffix: "strategic-planning",
    workPackages: [
      {
        id: 1,
        label:
          "Service demand defined and described and integrated into 5Y plan of SSC.",
        description:
          "The service has been formally identified, scoped and added to the 5-year SSC strategic roadmap.",
      },
    ],
    nextRoute: "budget",
    prevRoute: null,
  },
  {
    stageKey: "budget",
    stageNumber: 2,
    pageTitle: "Budget",
    pageSubtitle:
      "Release of service implementation — budget confirmation and resource allocation",
    storageKeySuffix: "budget",
    workPackages: [
      {
        id: 1,
        label: "Service profile is available.",
        description:
          "A complete service profile document exists and is accessible to all stakeholders.",
      },
      {
        id: 2,
        label: "SSC location and vertical are defined.",
        description:
          "The specific SSC location and the business vertical responsible for the service are confirmed.",
      },
      {
        id: 3,
        label:
          "Service volumes (= charging volume / costs) and cost avoidance are evaluated.",
        description:
          "Charging volumes and expected cost avoidance figures have been calculated and documented.",
      },
      {
        id: 4,
        label:
          "HQ unit confirmed the absorption of the expected relevant costs (charging costs).",
        description:
          "The relevant HQ business unit has formally confirmed they will absorb the charging costs.",
      },
      {
        id: 5,
        label: "Responsible at HQ unit and TSSC are defined.",
        description:
          "Named responsible persons at both HQ unit and TSSC have been assigned and documented.",
      },
      {
        id: 6,
        label: "Communication to the respective location is completed.",
        description:
          "All relevant stakeholders at the SSC location have been informed of the upcoming transition.",
      },
    ],
    nextRoute: "operative-planning",
    prevRoute: "strategic-planning",
  },
  {
    stageKey: "operative-planning",
    stageNumber: 3,
    pageTitle: "Operative Planning",
    pageSubtitle:
      "Kick-off of transitions with SSC locations · Creation of job descriptions · Recruitment release",
    storageKeySuffix: "operative-planning",
    workPackages: [
      {
        id: 1,
        label: "Transition team is in place and kick-off has been conducted.",
        description:
          "The full transition team has been assembled and a formal kick-off session has taken place.",
      },
      {
        id: 2,
        label:
          "Milestone plan is available (incl. process description, training plan, knowledge transfer, test phase, communication concept).",
        description:
          "A detailed milestone plan covering all key workstreams has been created and shared.",
      },
      {
        id: 3,
        label:
          "Recruiting plan & cost estimate (for recruitment) based on service profiles / job descriptions are available.",
        description:
          "Job descriptions are finalised and a recruiting plan with cost estimates is ready.",
      },
      {
        id: 4,
        label: "Charging rate re-calculated based on job description.",
        description:
          "The service charging rate has been recalculated using the finalised job descriptions.",
      },
      {
        id: 5,
        label:
          "The unit re-confirmed the absorption of the estimated, relevant costs (charging costs).",
        description:
          "The HQ unit has re-confirmed their acceptance of the estimated charging costs.",
      },
      {
        id: 6,
        label: "Release of recruitment is completed (by Global TSSC Head).",
        description:
          "The Global TSSC Head has formally released approval to begin recruitment.",
      },
    ],
    nextRoute: "execution",
    prevRoute: "budget",
  },
  {
    stageKey: "execution",
    stageNumber: 4,
    pageTitle: "Execution",
    pageSubtitle:
      "Recruiting · Training · Knowledge transfer · Onboarding · Cut-over · Hypercare · Stabilisation",
    storageKeySuffix: "execution",
    workPackages: [
      {
        id: 1,
        label: "Recruitment completed.",
        description:
          "All required FTE positions have been successfully filled.",
      },
      {
        id: 2,
        label: "Training material, IT systems and workspace are prepared.",
        description:
          "All training materials, IT infrastructure and physical workspaces are ready for onboarding.",
      },
      {
        id: 3,
        label: "Process & documentation packages are finalised.",
        description:
          "All SOPs, process maps and documentation packages have been reviewed and approved.",
      },
      {
        id: 4,
        label: "Onboarding / knowledge transfer sessions completed.",
        description:
          "All onboarding and knowledge transfer sessions with HQ counterparts have been completed.",
      },
      {
        id: 5,
        label: "Cut-over completed and signed off by HQ stakeholder.",
        description:
          "The cut-over has been executed and formally signed off by the responsible HQ stakeholder.",
      },
      {
        id: 6,
        label: "Hypercare period concluded without P1 incidents.",
        description:
          "The hypercare support period has ended with no Priority 1 incidents recorded.",
      },
      {
        id: 7,
        label: "Stabilisation confirmed by both SSC and HQ leads.",
        description:
          "Both SSC and HQ leads have confirmed the service is stable and operating as expected.",
      },
    ],
    nextRoute: "monitoring",
    prevRoute: "operative-planning",
  },
  {
    stageKey: "monitoring",
    stageNumber: 5,
    pageTitle: "Monitoring",
    pageSubtitle:
      "Tracking service effectivity & continuous improvement — steady state operations",
    storageKeySuffix: "monitoring",
    workPackages: [
      {
        id: 1,
        label: "Services are P&L effective.",
        description:
          "The service is confirmed to be P&L effective and contributing positively to the SSC financials.",
      },
      {
        id: 2,
        label: "Monitoring of service effectivity is implemented.",
        description:
          "A continuous monitoring framework for service KPIs and SLAs has been implemented.",
      },
    ],
    nextRoute: null,
    prevRoute: "execution",
    finalRedirect: "project",
  },
];

export function getStagePageData(
  stageKey: string
): DOIStagePageData | undefined {
  return DOI_STAGE_PAGES.find((s) => s.stageKey === stageKey);
}

/** localStorage key for per-project, per-stage persisted form data */
export function doiStorageKey(projectId: string, stageKey: string): string {
  return `pc.doi.${projectId}.${stageKey}`;
}

export interface DOIStageFormData {
  checked: Record<number, boolean>;
  startDate: string;
  endDate: string;
  results: string;
  nextSteps: string;
  criticalPoints: string;
}

export function loadStageData(
  projectId: string,
  stageKey: string
): DOIStageFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(doiStorageKey(projectId, stageKey));
    if (!raw) return null;
    return JSON.parse(raw) as DOIStageFormData;
  } catch {
    return null;
  }
}

export function saveStageData(
  projectId: string,
  stageKey: string,
  data: DOIStageFormData
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    doiStorageKey(projectId, stageKey),
    JSON.stringify(data)
  );
}

/** Returns completion % (0-100) for a given stage based on stored data */
export function getStageCompletion(
  projectId: string,
  stageKey: string
): number {
  const stagePage = getStagePageData(stageKey);
  if (!stagePage) return 0;
  const data = loadStageData(projectId, stageKey);
  if (!data?.checked) return 0;
  const total = stagePage.workPackages.length;
  const done = Object.values(data.checked).filter(Boolean).length;
  return total > 0 ? Math.round((done / total) * 100) : 0;
}
