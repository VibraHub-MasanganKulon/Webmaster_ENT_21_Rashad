import { prisma } from '@/lib/prisma'

export async function getAllMedia() {
  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploader: true },
  })
}

export async function getMediaByType(mediaType: 'image' | 'video') {
  return prisma.media.findMany({
    where: { mediaType },
    orderBy: { createdAt: 'desc' },
  })
}

export type CreateMediaInput = {
  uploadedBy: string
  fileName: string
  fileUrl: string
  mediaType: 'image' | 'video'
  mimeType: string
  fileSizeBytes: number
  videoDurationSeconds?: number | null
}

export async function createMediaRecord(data: CreateMediaInput) {
  return prisma.media.create({
    data: {
      uploadedBy: data.uploadedBy,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      mediaType: data.mediaType,
      mimeType: data.mimeType,
      fileSizeBytes: BigInt(data.fileSizeBytes),
      videoDurationSeconds: data.videoDurationSeconds ?? null,
    },
  })
}
