import api from "./api"
import type { CreateCustomOrderRequest, CustomOrderResponse, CustomOrderStatus } from "../types/custom-order"

export async function createCustomOrder(clientId: string, data: CreateCustomOrderRequest) {
  const { data: response } = await api.post<CustomOrderResponse>(`/api/custom-orders/client/${clientId}`, data)
  return response
}

export async function getCustomOrder(id: number) {
  const { data } = await api.get<CustomOrderResponse>(`/api/custom-orders/${id}`)
  return data
}

export async function getClientCustomOrders(clientId: string) {
  const { data } = await api.get<CustomOrderResponse[]>(`/api/custom-orders/client/${clientId}`)
  return data
}

export async function getAllCustomOrders() {
  const { data } = await api.get<CustomOrderResponse[]>("/api/custom-orders")
  return data
}

export async function updateCustomOrderStatus(id: number, status: CustomOrderStatus) {
  const { data } = await api.patch<CustomOrderResponse>(`/api/custom-orders/${id}/status`, null, {
    params: { status },
  })
  return data
}

export async function uploadLogo(id: number, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<CustomOrderResponse>(`/api/custom-orders/${id}/logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function uploadPreview(id: number, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<CustomOrderResponse>(`/api/custom-orders/${id}/preview`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}
