'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export default function SiswaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sman1_user');
    if (!saved) {
      router.replace('/login');
      return;
    }
    try {
      const user: User = JSON.parse(saved);
      if (user.role === 'GURU_BK') {
        router.replace('/admin');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Memverifikasi sesi siswa...
      </div>
    );
  }

  return <>{children}</>;
}
