import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pemetaan Jurusan & Karir | SMAN 1 Bandung',
  description: 'Aplikasi Web Mapping Jurusan Pendidikan Tinggi dan Prospek Karir Berbasis Nilai Akademik di SMAN 1 Bandung menggunakan Algoritma Rule-Based Matching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
