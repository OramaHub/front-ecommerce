import { useState, useEffect } from "react"
import { getAllProductsAdmin } from "../services/product-service"
import { getAllOrders } from "../services/order-service"
import { getAllClients } from "../services/client-service"
import type { Order } from "../types/order"

interface DashboardData {
  totalProducts: number
  totalOrders: number
  totalClients: number
  recentOrders: Order[]
}

interface UseAdminDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [products, orders, clients] = await Promise.all([
          getAllProductsAdmin(0, 1),
          getAllOrders(0, 5),
          getAllClients(0, 1),
        ])

        setData({
          totalProducts: products.totalElements,
          totalOrders: orders.totalElements,
          totalClients: clients.totalElements,
          recentOrders: orders.content,
        })
      } catch {
        setError("Não foi possível carregar os dados do painel.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading, error }
}
