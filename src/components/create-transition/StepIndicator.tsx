/**
 * components/create-transition/StepIndicator.tsx
 *
 * Horizontal step indicator — 5 steps with connecting lines.
 * Active step is highlighted; completed steps show a check.
 */
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREATE_STEPS } from "@/data/transitionData";

interface StepIndicatorProps {
  current: number; // 0-based index
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {CREATE_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const upcoming = i > current;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
                  done && "bg-rag-green text-white",
                  active &&
                    "bg-brand text-brand-foreground shadow-elevated scale-110",
                  upcoming && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-medium text-center leading-tight md:block",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < CREATE_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-1 mb-4 rounded-full transition-colors duration-300",
                  done ? "bg-rag-green" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
