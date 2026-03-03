import api from "./api"
import type { MediaImage } from "../types/media"
import type { PageResponse } from "../types/common"

export async function getMedia(page = 0, size = 24) {
  const { data } = await api.get<PageResponse<MediaImage>>("/api/media", {
    params: { page, size },
  })
  return data
}

export async function uploadMedia(file: File): Promise<MediaImage> {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<MediaImage>("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function deleteMedia(id: number) {
  await api.delete(`/api/media/${id}`)
}
