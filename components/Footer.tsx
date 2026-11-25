'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-[#f7f7f5] border-t border-[#111211]/10 py-6 no-print">
      <div className="max-w-7xl mx-auto px-5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#878a86]">
        <span className="font-medium text-[#111211]">
          SMAN 1 Bandung · Sistem Pemetaan Jurusan &amp; Karir
        </span>
        <span className="font-mono-cairn text-[11px]">
          Kelompok A5 ITENAS (Sakhiy Amru, Ni Made Salsa, Kahla Arsyaba)
        </span>
      </div>
    </footer>
  );
}
