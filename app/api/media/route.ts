import { NextResponse } from 'next/server'
import { getAllMedia, getMediaByType } from '@/services/media.service'

export async function GET(request: Request) {
  // Auth belum di-enforce (mode tes coding) — lihat catatan di src/lib/session.ts
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const media =
    type === 'image' || type === 'video' ? await getMediaByType(type) : await getAllMedia()

  // fileSizeBytes bertipe BigInt — tidak bisa langsung di-serialize JSON, konversi dulu ke string
  const serialized = media.map((m) => ({
    ...m,
    fileSizeBytes: m.fileSizeBytes.toString(),
  }))

  return NextResponse.json(serialized)
}
