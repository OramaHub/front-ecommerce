import { useState } from "react"
import { X } from "lucide-react"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { Order, OrderStatus } from "../../types/order"

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAYMENT_CONFIRMED", label: "Pagamento confirmado" },
  { value: "PROCESSING", label: "Em produção" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
]

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
  onUpdateStatus: (id: number, status: OrderStatus) => Promise<void>
}

export function OrderDetailsModal({ order, onClose, onUpdateStatus }: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasStatusChanged = selectedStatus !== order.status

  async function handleConfirmStatus() {
    setError(null)
    setSubmitting(true)
    try {
      await onUpdateStatus(order.id, selectedStatus)
      onClose()
    } catch {
      setError("Não foi possível atualizar o status.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold font-jakarta">{order.orderNumber}</h2>
            <p className="text-xs text-gray-500 font-jakarta mt-0.5">
              {new Date(order.orderDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {order.clientName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors ml-4 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Produto</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Qtd</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Unitário</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-3 text-sm font-jakarta text-gray-800">{item.productName}</td>
                    <td className="py-3 text-sm font-jakarta text-gray-600 text-center">{item.quantity}</td>
                    <td className="py-3 text-sm font-jakarta text-gray-600 text-right">
                      {item.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="py-3 text-sm font-jakarta font-medium text-black text-right">
                      {item.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-1 text-sm font-jakarta">
            <div className="flex gap-8 text-gray-500">
              <span>Subtotal</span>
              <span>{order.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex gap-8 text-green-600">
                <span>Desconto</span>
                <span>− {order.discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            )}
            <div className="flex gap-8 font-semibold text-black text-base border-t border-gray-100 pt-1 mt-1">
              <span>Total</span>
              <span>{order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-jakarta text-gray-700">Status atual</span>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                onClick={handleConfirmStatus}
                disabled={!hasStatusChanged || submitting}
                className="px-4 py-2 bg-black text-white text-sm font-jakarta font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {submitting ? "Salvando..." : "Confirmar"}
              </button>
            </div>

            {error && <p className="text-sm text-red-600 font-jakarta">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
