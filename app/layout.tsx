import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pemetaan Jurusan & Karir | SMAN 1 Bandung',
  description:
    'Sistem Pemetaan Jurusan Pendidikan Tinggi dan Prospek Karir Berbasis Nilai Akademik Rapor di SMAN 1 Bandung.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-svh bg-[#f7f7f5] text-[#111211] antialiased selection:bg-[#e4572e] selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
