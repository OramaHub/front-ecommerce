import api from "./api"
import type { Cart } from "../types/cart"

export async function getActiveCart(clientId: string) {
  const { data } = await api.get<Cart>(`/api/carts/client/${clientId}/active`)
  return data
}

export async function addItem(clientId: string, productId: number, quantity: number) {
  const { data } = await api.post(`/api/carts/client/${clientId}/items`, { productId, quantity })
  return data
}

export async function updateItemQuantity(clientId: string, cartItemId: number, quantity: number) {
  const { data } = await api.put(`/api/carts/client/${clientId}/items/${cartItemId}`, { quantity })
  return data
}

export async function removeItem(clientId: string, cartItemId: number) {
  await api.delete(`/api/carts/client/${clientId}/items/${cartItemId}`)
}

export async function clearCart(clientId: string) {
  await api.delete(`/api/carts/client/${clientId}/clear`)
}
