"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface ModernHeroProps {
  badge?: string;
  heading: string;
  description: string;
  primaryButton?: {
    text: string;
    url: string;
  };
  secondaryButton?: {
    text: string;
    url: string;
  };
  metrics?: {
    label: string;
    value: string | number;
  }[];
}

export function ModernHero({
  badge,
  heading,
  description,
  primaryButton,
  secondaryButton,
  metrics,
}: ModernHeroProps) {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {badge && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#d6e4f0] text-[#1e3a8a] text-xs font-semibold">
            {badge}
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#333333] tracking-tight leading-tight">
            {heading}
          </h1>
          <p className="text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {(primaryButton || secondaryButton) && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {primaryButton && (
              <Link
                href={primaryButton.url}
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#df6035] hover:bg-[#c8522b] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>{primaryButton.text}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            {secondaryButton && (
              <Link
                href={secondaryButton.url}
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-white hover:bg-[#f4f5f7] text-[#2f4b79] border border-[#cccccc] text-sm font-semibold transition-colors inline-flex items-center"
              >
                <span>{secondaryButton.text}</span>
              </Link>
            )}
          </div>
        )}

        {metrics && metrics.length > 0 && (
          <div className="pt-6 max-w-md mx-auto grid grid-cols-3 gap-4 border-t border-[#cccccc]/70">
            {metrics.map((m, idx) => (
              <div key={idx} className="text-center">
                <div className="font-mono text-xl sm:text-2xl font-bold text-[#2f4b79]">
                  {m.value}
                </div>
                <div className="text-xs text-[#6b7280]">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
