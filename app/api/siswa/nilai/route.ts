import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getLinkedCareersForJurusan } from '@/lib/career-linker';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId');
    const semesterParam = searchParams.get('semester');

    if (!siswaId) {
      return NextResponse.json({ success: false, message: 'siswaId dibutuhkan' }, { status: 400 });
    }

    const semester = semesterParam ? parseInt(semesterParam) : undefined;
    const nilaiList = db.getNilaiSiswa(parseInt(siswaId), semester);
    return NextResponse.json({ success: true, data: nilaiList });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { siswaId, nilaiList, semester } = await request.json();

    if (!siswaId || !Array.isArray(nilaiList)) {
      return NextResponse.json({ success: false, message: 'siswaId dan nilaiList wajib diisi' }, { status: 400 });
    }

    const semesterScope = semester !== undefined && semester !== null ? parseInt(semester) : undefined;
    const calculation = db.saveNilaiSiswaAndCalculate(parseInt(siswaId), nilaiList, semesterScope);

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
      message: 'Nilai rapor berhasil disimpan dan hasil pemetaan diperbarui.',
      data: {
        ...calculation,
        results: topResultsWithCareers
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswaId');
    const semesterParam = searchParams.get('semester');
    const mapelIdParam = searchParams.get('mapelId');

    if (!siswaId) {
      return NextResponse.json({ success: false, message: 'siswaId dibutuhkan' }, { status: 400 });
    }

    const semester = semesterParam ? parseInt(semesterParam) : undefined;
    const mapelId = mapelIdParam ? parseInt(mapelIdParam) : undefined;

    db.deleteNilaiSiswa(parseInt(siswaId), semester, mapelId);
    return NextResponse.json({
      success: true,
      message: 'Data nilai berhasil dihapus dan hasil pemetaan diperbarui.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
