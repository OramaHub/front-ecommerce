import { useState, useEffect, useCallback } from "react"
import { getMedia, uploadMedia, deleteMedia } from "../services/media-service"
import type { MediaImage } from "../types/media"

export function useAdminMedia() {
  const [media, setMedia] = useState<MediaImage[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = useCallback(async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMedia(p, 24)
      setMedia(data.content)
      setTotalPages(data.totalPages)
    } catch {
      setError("Erro ao carregar imagens.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedia(page)
  }, [page, fetchMedia])

  async function upload(file: File): Promise<MediaImage> {
    setUploading(true)
    try {
      const created = await uploadMedia(file)
      await fetchMedia(page)
      return created
    } finally {
      setUploading(false)
    }
  }

  async function remove(id: number) {
    await deleteMedia(id)
    setMedia((prev) => prev.filter((m) => m.id !== id))
  }

  return { media, totalPages, page, loading, uploading, error, setPage, upload, remove }
}
