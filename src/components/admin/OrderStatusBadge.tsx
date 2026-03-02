import type { OrderStatus } from "../../types/order"

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  PAYMENT_CONFIRMED: { label: "Pgto. confirmado", className: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "Em produção", className: "bg-indigo-100 text-indigo-800" },
  SHIPPED: { label: "Enviado", className: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Entregue", className: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Reembolsado", className: "bg-orange-100 text-orange-800" },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-jakarta ${config.className}`}>
      {config.label}
    </span>
  )
}
