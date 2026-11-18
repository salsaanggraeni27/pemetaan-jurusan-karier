import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [list, relasi] = await Promise.all([
      db.getKarir(),
      db.getRelasiJurusanKarir()
    ]);
    return NextResponse.json({ success: true, data: list, relasi });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.profesi || !body.industri) {
      return NextResponse.json({ success: false, message: 'Profesi dan industri wajib diisi' }, { status: 400 });
    }

    const { jurusanIds, ...karirPayload } = body;
    const saved = await db.saveKarir(karirPayload);
    if (Array.isArray(jurusanIds)) {
      await db.setRelasiForKarir(saved.id, jurusanIds);
    }
    return NextResponse.json({ success: true, data: saved, message: 'Data karir berhasil disimpan' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID karir dibutuhkan' }, { status: 400 });
    }

    await db.deleteKarir(parseInt(id));
    return NextResponse.json({ success: true, message: 'Data karir berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

