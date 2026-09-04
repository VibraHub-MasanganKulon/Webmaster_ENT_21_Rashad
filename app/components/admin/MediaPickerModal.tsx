'use client'

import { useEffect, useState } from 'react'

export type PickedMedia = {
  id: string
  fileName: string
  fileUrl: string
  mediaType: 'image' | 'video'
}

type MediaPickerModalProps = {
  mediaType: 'image' | 'video'
  isOpen: boolean
  onClose: () => void
  onConfirm: (selected: PickedMedia[]) => void
  multiple?: boolean
}

export default function MediaPickerModal({
  mediaType,
  isOpen,
  onClose,
  onConfirm,
  multiple = true,
}: MediaPickerModalProps) {
  const [items, setItems] = useState<PickedMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isOpen) return

    setLoading(true)
    fetch(`/api/media?type=${mediaType}`)
      .then((res) => res.json())
      .then((data: PickedMedia[]) => setItems(data))
      .finally(() => setLoading(false))
  }, [isOpen, mediaType])

  if (!isOpen) return null

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(multiple ? prev : [])
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  function handleConfirm() {
    const selected = items.filter((item) => selectedIds.has(item.id))
    onConfirm(selected)
    setSelectedIds(new Set())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pilih {mediaType === 'image' ? 'Gambar' : 'Video'} dari Media Library
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {loading && <p className="py-8 text-center text-sm text-gray-500">Memuat media...</p>}

        {!loading && items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            Belum ada {mediaType === 'image' ? 'gambar' : 'video'} di Media Library.
            <br />
            Upload dulu lewat menu Media Library sebelum memilihnya di sini.
          </p>
        )}

        {!loading && items.length > 0 && (
          <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id)
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`relative overflow-hidden rounded-lg border-2 text-left transition ${
                    isSelected ? 'border-brand-500' : 'border-transparent'
                  }`}
                >
                  {item.mediaType === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.fileUrl}
                      alt={item.fileName}
                      className="h-24 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center bg-gray-100 text-2xl">
                      🎬
                    </div>
                  )}
                  <span className="block truncate bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {item.fileName}
                  </span>
                  {isSelected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            Pilih ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  )
}
