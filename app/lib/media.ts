// src/lib/media.ts
const PLACEHOLDER_IMAGE = '/images/placeholder/no-image.svg'

export function resolveImageUrl(fileUrl?: string | null): string {
  return fileUrl && fileUrl.trim() !== '' ? fileUrl : PLACEHOLDER_IMAGE
}