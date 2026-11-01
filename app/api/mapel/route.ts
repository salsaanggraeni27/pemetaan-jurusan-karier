import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.getMapel();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nama_mapel || !body.kategori) {
      return NextResponse.json({ success: false, message: 'Nama mapel dan kategori wajib diisi' }, { status: 400 });
    }

    const saved = db.saveMapel(body);
    return NextResponse.json({ success: true, data: saved, message: 'Mata pelajaran berhasil disimpan' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID mapel dibutuhkan' }, { status: 400 });
    }

    db.deleteMapel(parseInt(id));
    return NextResponse.json({ success: true, message: 'Mata pelajaran berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

