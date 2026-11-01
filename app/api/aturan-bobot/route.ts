import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jurusanId = searchParams.get('jurusanId');

    if (jurusanId) {
      const rules = db.getAturanBobotByJurusan(parseInt(jurusanId));
      return NextResponse.json({ success: true, data: rules });
    }

    const allRules = db.getAturanBobot();
    return NextResponse.json({ success: true, data: allRules });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { jurusanId, rules } = await request.json();

    if (!jurusanId || !Array.isArray(rules)) {
      return NextResponse.json({ success: false, message: 'Jurusan ID dan daftar rules wajib diisi' }, { status: 400 });
    }

    const updated = db.updateAturanBobotForJurusan(parseInt(jurusanId), rules);
    return NextResponse.json({
      success: true,
      message: 'Matriks pembobotan berhasil diperbarui',
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

