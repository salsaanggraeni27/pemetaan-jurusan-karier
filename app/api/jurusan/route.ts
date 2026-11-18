import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [list, relasi] = await Promise.all([
      db.getJurusan(),
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
    if (!body.nama_jurusan || !body.rumpun) {
      return NextResponse.json({ success: false, message: 'Nama jurusan dan rumpun wajib diisi' }, { status: 400 });
    }

    const { karirIds, ...jurusanPayload } = body;
    const saved = await db.saveJurusan(jurusanPayload);
    if (Array.isArray(karirIds)) {
      await db.setRelasiForJurusan(saved.id_jurusan, karirIds);
    }
    return NextResponse.json({ success: true, data: saved, message: 'Data jurusan berhasil disimpan' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID jurusan dibutuhkan' }, { status: 400 });
    }

    await db.deleteJurusan(parseInt(id));
    return NextResponse.json({ success: true, message: 'Data jurusan berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

