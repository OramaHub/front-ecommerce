import api from "./api"
import type { Address } from "../types/address"

export async function getAddresses() {
  const { data } = await api.get<Address[]>("/api/addresses")
  return data
}

export async function getDefaultAddress() {
  const { data } = await api.get<Address>("/api/addresses/default")
  return data
}

export async function createAddress(addressData: Omit<Address, "id" | "clientId" | "cityName" | "createdAt" | "updatedAt">) {
  const { data } = await api.post<Address>("/api/addresses", addressData)
  return data
}

export async function updateAddress(id: number, addressData: Omit<Address, "id" | "clientId" | "cityName" | "createdAt" | "updatedAt">) {
  const { data } = await api.put<Address>(`/api/addresses/${id}`, addressData)
  return data
}

export async function deleteAddress(id: number) {
  await api.delete(`/api/addresses/${id}`)
}

export async function setDefault(id: number) {
  const { data } = await api.patch<Address>(`/api/addresses/${id}/set-default`)
  return data
}
