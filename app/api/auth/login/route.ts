import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { nisn_nip, password } = await request.json();

    if (!nisn_nip) {
      return NextResponse.json({ success: false, message: 'NISN / NIP harus diisi' }, { status: 400 });
    }

    const user = db.getUserByNisnNip(nisn_nip);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Akun dengan NISN/NIP tersebut tidak ditemukan' }, { status: 404 });
    }

    // Cek password sederhana (password default: password123 atau admin)
    if (user.password && password && user.password !== password) {
      return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
    }

    // Return user info (tanpa password)
    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: safeUser
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
