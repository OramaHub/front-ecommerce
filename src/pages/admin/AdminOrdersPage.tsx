import { useState } from "react"
import { Eye } from "lucide-react"
import { useAdminOrders } from "../../hooks/useAdminOrders"
import { OrderStatusBadge } from "../../components/admin/OrderStatusBadge"
import { OrderDetailsModal } from "../../components/admin/OrderDetailsModal"
import { Pagination } from "../../components/admin/Pagination"
import type { Order, OrderStatus } from "../../types/order"

const statusOptions: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "PENDING", label: "Pendente" },
  { value: "PAYMENT_CONFIRMED", label: "Pagamento confirmado" },
  { value: "PROCESSING", label: "Em produção" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
]

export function AdminOrdersPage() {
  const {
    orders,
    totalPages,
    totalElements,
    page,
    statusFilter,
    loading,
    error,
    setPage,
    setStatusFilter,
    updateStatus,
  } = useAdminOrders()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (error) {
    return <p className="text-sm text-red-600 font-jakarta">{error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold font-jakarta">Pedidos</h1>
          {!loading && (
            <p className="text-sm text-gray-500 font-jakarta mt-0.5">{totalElements} pedido(s)</p>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Nº Pedido</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Cliente</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
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
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
                          title="Ver detalhes"
                          className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  )
}
