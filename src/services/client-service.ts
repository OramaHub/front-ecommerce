import api from "./api"

export async function getClient(id: string) {
  const { data } = await api.get(`/api/clients/${id}`)
  return data
}

export async function updateClient(id: string, clientData: { name: string; email: string; phone: string }) {
  const { data } = await api.put(`/api/clients/${id}`, clientData)
  return data
}

export async function changePassword(id: string, currentPassword: string, newPassword: string) {
  const { data } = await api.patch(`/api/clients/${id}/password`, { currentPassword, newPassword })
  return data
}
