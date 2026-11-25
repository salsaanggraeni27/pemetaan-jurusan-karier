"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
  href?: string;
  onClick?: () => void;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {items.map((item, index) => {
        const cardClasses = cn(
          "group relative p-5 rounded-xl overflow-hidden transition-all duration-300 text-left",
          "border border-[#cccccc]/80 bg-white",
          "hover:shadow-[0_4px_16px_rgba(26,26,26,0.06)] hover:border-[#df6035]/50",
          "hover:-translate-y-0.5 will-change-transform",
          item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
          item.colSpan === 3 ? "md:col-span-3" : "",
          (item.href || item.onClick) ? "cursor-pointer" : "",
          {
            "shadow-[0_4px_16px_rgba(26,26,26,0.05)] border-[#2f4b79]/30":
              item.hasPersistentHover,
          }
        );

        const inner = (
          <>
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                item.hasPersistentHover
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,75,121,0.035)_1px,transparent_1px)] bg-[length:6px_6px]" />
            </div>

            <div className="relative flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#d6e4f0]/60 text-[#2f4b79] transition-colors duration-300 group-hover:bg-[#df6035]/15 group-hover:text-[#df6035]">
                    {item.icon}
                  </div>
                  {item.status && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f4f5f7] text-[#2f4b79] border border-[#cccccc]/60">
                      {item.status}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-semibold text-[#333333] tracking-tight text-base flex flex-wrap items-baseline gap-2">
                    <span>{item.title}</span>
                    {item.meta && (
                      <span className="text-xs font-mono text-[#6b7280] font-normal">
                        {item.meta}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {(item.tags?.length || item.cta) && (
                <div className="flex items-center justify-between pt-2 border-t border-[#e8ebed]">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b7280]">
                    {item.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#f4f5f7] text-[#333333] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {item.cta && (
                    <span className="text-xs font-semibold text-[#df6035] group-hover:translate-x-0.5 transition-transform">
                      {item.cta}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        );

        if (item.href) {
          return (
            <Link key={index} href={item.href} className={cardClasses}>
              {inner}
            </Link>
          );
        }

        if (item.onClick) {
          return (
            <button
              key={index}
              type="button"
              onClick={item.onClick}
              className={cardClasses}
            >
              {inner}
            </button>
          );
        }

        return (
          <div key={index} className={cardClasses}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
