import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.getKarir();
    const relasi = db.getRelasiJurusanKarir();
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

    const saved = db.saveKarir(body);
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

    db.deleteKarir(parseInt(id));
    return NextResponse.json({ success: true, message: 'Data karir berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
