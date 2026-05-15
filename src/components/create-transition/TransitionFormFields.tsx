/**
 * components/create-transition/TransitionFormFields.tsx
 *
 * Small, composable field primitives used across all steps:
 *   <Field>       — label + children wrapper
 *   <TextInput>   — styled text / number / date input
 *   <SelectInput> — styled native select
 *   <Textarea>    — styled textarea
 *
 * These follow the existing project design tokens exactly.
 */
import type { ReactNode, ChangeEvent } from "react";

const BASE =
  "h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none " +
  "focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors";

/* ── Field ──────────────────────────────────────────────────────────────── */
export function Field({
  label,
  hint,
  children,
  full,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  full?: boolean;
  required?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-rag-red">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ── TextInput ──────────────────────────────────────────────────────────── */
export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  disabled,
  required,
}: {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "date" | "email";
  min?: string | number;
  step?: string | number;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      step={step}
      disabled={disabled}
      required={required}
      className={BASE + (disabled ? " opacity-50 cursor-not-allowed" : "")}
    />
  );
}

/* ── SelectInput ────────────────────────────────────────────────────────── */
export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      disabled={disabled}
      className={
        BASE +
        " pr-8 appearance-none bg-[image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_10px_center]" +
        (disabled ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ── Textarea ───────────────────────────────────────────────────────────── */
export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={
        "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none " +
        "focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none transition-colors"
      }
    />
  );
}
