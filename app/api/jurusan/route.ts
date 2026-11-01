import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.getJurusan();
    return NextResponse.json({ success: true, data: list });
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

    const saved = db.saveJurusan(body);
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

    db.deleteJurusan(parseInt(id));
    return NextResponse.json({ success: true, message: 'Data jurusan berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
