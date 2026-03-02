import { useState, useEffect } from "react"
import { getAllOrders, updateOrderStatus } from "../services/order-service"
import type { Order, OrderStatus } from "../types/order"

interface UseAdminOrdersReturn {
  orders: Order[]
  totalPages: number
  totalElements: number
  page: number
  statusFilter: OrderStatus | ""
  loading: boolean
  error: string | null
  setPage: (page: number) => void
  setStatusFilter: (status: OrderStatus | "") => void
  updateStatus: (id: number, status: OrderStatus) => Promise<void>
}

export function useAdminOrders(): UseAdminOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllOrders(page, 10, statusFilter || undefined)
        setOrders(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      } catch {
        setError("Não foi possível carregar os pedidos.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, statusFilter, refreshKey])

  function handleSetStatusFilter(status: OrderStatus | "") {
    setStatusFilter(status)
    setPage(0)
  }

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function updateStatus(id: number, status: OrderStatus) {
    await updateOrderStatus(id, status)
    refresh()
  }

  return {
    orders,
    totalPages,
    totalElements,
    page,
    statusFilter,
    loading,
    error,
    setPage,
    setStatusFilter: handleSetStatusFilter,
    updateStatus,
  }
}
