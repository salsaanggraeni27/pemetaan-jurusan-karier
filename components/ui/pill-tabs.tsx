"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PillOption =
  | { label: string; value: string }
  | { label: string; id: string }
  | string;

interface PillTabsProps {
  options?: PillOption[];
  tabs?: PillOption[];
  value?: string;
  activeTab?: string;
  onChange: (val: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function PillTabs({
  options,
  tabs,
  value,
  activeTab,
  onChange,
  className,
  ariaLabel = "Pilih kategori",
}: PillTabsProps) {
  const source = options ?? tabs ?? [];
  const current = value ?? activeTab ?? "";
  const normalized = source.map((opt) => {
    if (typeof opt === "string") return { label: opt, value: opt };
    if ("value" in opt) return opt;
    return { label: opt.label, value: opt.id };
  });

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <select
        aria-label={ariaLabel}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-4 pr-10 rounded-full bg-[#ebebe8] border border-[#111211]/15 text-[13.5px] font-medium text-[#111211] appearance-none cursor-pointer focus:outline-none focus:border-[#2a6ee0] transition-colors"
      >
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="w-4 h-4 text-[#5c5f5b] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
