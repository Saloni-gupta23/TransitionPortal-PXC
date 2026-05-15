/**
 * components/create-transition/FormPrimitives.tsx
 *
 * Field, Input, Select, and Textarea primitives that match the
 * existing ui-kit.tsx aesthetic (border-border, ring-ring, bg-card, etc.)
 * but tailored for the multi-step form.
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─── Field wrapper ────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: boolean;
  children: ReactNode;
  /** Spans both grid columns when used inside a 2-col grid */
  full?: boolean;
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
  full,
}: FieldProps) {
  return (
    <div className={cn(full && "md:col-span-2")}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-rag-red">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      {error && (
        <p className="mt-1 text-[11px] text-rag-red">This field is required.</p>
      )}
    </div>
  );
}

/* ─── Shared input class builder ───────────────────────────────────────────── */
function inputCls(error?: boolean) {
  return cn(
    "h-9 w-full rounded-md border bg-card px-3 text-sm outline-none transition-colors",
    "focus:border-ring focus:ring-2 focus:ring-ring/30",
    error
      ? "border-rag-red focus:border-rag-red focus:ring-rag-red/20"
      : "border-border"
  );
}

/* ─── Input ────────────────────────────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function FormInput({ error, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        inputCls(error),
        props.disabled && "cursor-not-allowed opacity-50",
        className
      )}
    />
  );
}

/* ─── Select ───────────────────────────────────────────────────────────────── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[];
  placeholder?: string;
  error?: boolean;
}

export function FormSelect({
  options,
  placeholder = "Select…",
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={cn(
        inputCls(error),
        props.disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ─── Textarea ─────────────────────────────────────────────────────────────── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function FormTextarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border bg-card px-3 py-2 text-sm outline-none transition-colors resize-none leading-relaxed",
        "placeholder:text-muted-foreground",
        "focus:border-ring focus:ring-2 focus:ring-ring/30",
        error ? "border-rag-red" : "border-border",
        className
      )}
    />
  );
}

/* ─── Section card wrapper ─────────────────────────────────────────────────── */
interface SectionProps {
  title: string;
  subtitle?: string;
  accentClass?: string; // tailwind gradient class e.g. "from-brand to-brand-deep"
  children: ReactNode;
}

export function FormSection({
  title,
  subtitle,
  accentClass = "from-brand to-brand-deep",
  children,
}: SectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className={cn("h-1 w-full bg-gradient-to-r", accentClass)} />
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
    </div>
  );
}
