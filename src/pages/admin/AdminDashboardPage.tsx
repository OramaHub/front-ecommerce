import { Package, ShoppingCart, Users } from "lucide-react"
import { useAdminDashboard } from "../../hooks/useAdminDashboard"
import { OrderStatusBadge } from "../../components/admin/OrderStatusBadge"
import type { Order } from "../../types/order"

function MetricCard({ icon: Icon, label, value, loading }: {
  icon: React.ElementType
  label: string
  value: number
  loading: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-gray-700" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-jakarta">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-16 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold font-jakarta text-black">{value.toLocaleString("pt-BR")}</p>
        )}
      </div>
    </div>
  )
}

function RecentOrdersTable({ orders, loading }: {
  orders: Order[]
  loading: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold font-jakarta">Pedidos recentes</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Nº Pedido</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Data</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Cliente</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Total</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium font-jakarta text-black">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-jakarta">
                      {new Date(order.orderDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-jakarta">{order.clientName}</td>
                    <td className="px-6 py-4 text-sm font-medium font-jakarta text-black text-right">
                      {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && orders.length === 0 && (
          <p className="text-center text-sm text-gray-400 font-jakarta py-8">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const { data, loading, error } = useAdminDashboard()

  if (error) {
    return (
      <p className="text-sm text-red-600 font-jakarta">{error}</p>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold font-jakarta">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={Package} label="Produtos" value={data?.totalProducts ?? 0} loading={loading} />
        <MetricCard icon={ShoppingCart} label="Pedidos" value={data?.totalOrders ?? 0} loading={loading} />
        <MetricCard icon={Users} label="Clientes" value={data?.totalClients ?? 0} loading={loading} />
      </div>

      <RecentOrdersTable orders={data?.recentOrders ?? []} loading={loading} />
    </div>
  )
}
