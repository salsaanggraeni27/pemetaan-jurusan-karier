import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID dibutuhkan' }, { status: 400 });
    }

    const user = db.getUserById(parseInt(id));
    if (!user) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

