import api from "./api"
import type { Client, ClientDetail } from "../types/client"
import type { PageResponse } from "../types/common"

export async function getClient(id: string) {
  const { data } = await api.get<ClientDetail>(`/api/clients/${id}`)
  return data
}

export async function updateClient(id: string, clientData: { name: string; email: string; phone: string }) {
  const { data } = await api.put<ClientDetail>(`/api/clients/${id}`, clientData)
  return data
}

export async function changePassword(id: string, currentPassword: string, newPassword: string) {
  const { data } = await api.patch(`/api/clients/${id}/password`, { currentPassword, newPassword })
  return data
}

export async function getAllClients(page = 0, size = 10) {
  const { data } = await api.get<PageResponse<Client>>("/api/clients", {
    params: { page, size },
  })
  return data
}

export async function getClientByEmail(email: string) {
  const { data } = await api.get<Client>("/api/clients/email", {
    params: { email },
  })
  return data
}

export async function activateClient(id: number) {
  await api.patch(`/api/clients/${id}/activate`)
}

export async function deactivateClient(id: number) {
  await api.patch(`/api/clients/${id}/deactivate`)
}
