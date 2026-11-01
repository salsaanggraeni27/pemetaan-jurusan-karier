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

    const nilaiList = db.getNilaiSiswa(parseInt(siswaId));
    return NextResponse.json({ success: true, data: nilaiList });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { siswaId, nilaiList } = await request.json();

    if (!siswaId || !Array.isArray(nilaiList)) {
      return NextResponse.json({ success: false, message: 'siswaId dan nilaiList wajib diisi' }, { status: 400 });
    }

    // Eksekusi simpan nilai dan kalkulasi Rule-Based Matching Engine
    const calculation = db.saveNilaiSiswaAndCalculate(parseInt(siswaId), nilaiList);

    // Dapatkan karir terkait untuk 3 rekomendasi teratas
    const allJurusan = db.getJurusan();
    const allKarir = db.getKarir();
    const allRelasi = db.getRelasiJurusanKarir();

    const topResultsWithCareers = calculation.results.map(r => {
      const linkedCareer = getLinkedCareersForJurusan(r.jurusan.id_jurusan, allJurusan, allKarir, allRelasi);
      return {
        ...r,
        linkedCareer
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Perhitungan Rule-Based Matching berhasil dieksekusi',
      data: {
        ...calculation,
        results: topResultsWithCareers
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

