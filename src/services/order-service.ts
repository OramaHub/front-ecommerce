import api from "./api"
import type { Order } from "../types/order"

export async function createOrder(cartId: number, discount?: number) {
  const { data } = await api.post<Order>("/api/orders", { cartId, discount })
  return data
}

export async function getClientOrders(clientId: string) {
  const { data } = await api.get<Order[]>(`/api/orders/client/${clientId}`)
  return data
}

export async function cancelOrder(orderId: number) {
  const { data } = await api.patch<Order>(`/api/orders/${orderId}/cancel`)
  return data
}
