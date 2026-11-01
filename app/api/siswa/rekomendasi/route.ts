import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getLinkedCareersForJurusan } from '@/lib/career-linker';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId');

    if (!siswaId) {
      return NextResponse.json({ success: false, message: 'siswaId dibutuhkan' }, { status: 400 });
    }

    const calculation = db.getHasilRekomendasiSiswa(parseInt(siswaId));
    if (!calculation) {
      return NextResponse.json({
        success: false,
        message: 'Belum ada data nilai akademik yang diinput oleh siswa ini'
      });
    }

    const allJurusan = db.getJurusan();
    const allKarir = db.getKarir();
    const allRelasi = db.getRelasiJurusanKarir();

    const resultsWithCareers = calculation.results.map(r => {
      const linkedCareer = getLinkedCareersForJurusan(r.jurusan.id_jurusan, allJurusan, allKarir, allRelasi);
      return {
        ...r,
        linkedCareer
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...calculation,
        results: resultsWithCareers
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
