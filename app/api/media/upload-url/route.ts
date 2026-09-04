// src/app/api/media/upload-url/route.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => {
      // di sini bisa cek session/role sebelum kasih izin upload
      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'video/mp4'],
        maximumSizeInBytes: 200 * 1024 * 1024, // 200MB, sesuaikan kebutuhan
      }
    },
    onUploadCompleted: async ({ blob }) => {
      // simpan metadata ke media_library setelah upload sukses
      // panggil media.service.ts di sini
    },
  })

  return NextResponse.json(jsonResponse)
}