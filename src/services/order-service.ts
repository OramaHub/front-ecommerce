import api from "./api"
import type { Order, OrderStatus } from "../types/order"
import type { PageResponse } from "../types/common"

export async function createOrder(cartId: number, zipCode: string, discount?: number) {
  const { data } = await api.post<Order>("/api/orders", { cartId, zipCode, discount })
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

export async function getAllOrders(page = 0, size = 10, status?: OrderStatus) {
  const { data } = await api.get<PageResponse<Order>>("/api/orders", {
    params: { page, size, ...(status && { status }) },
  })
  return data
}

export async function getOrderById(id: number) {
  const { data } = await api.get<Order>(`/api/orders/${id}`)
  return data
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const { data } = await api.patch<Order>(`/api/orders/${id}/status`, null, {
    params: { status },
  })
  return data
}
