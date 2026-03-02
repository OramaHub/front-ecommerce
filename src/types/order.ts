export type OrderStatus =
  | "PENDING"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  orderNumber: string
  orderDate: string
  status: OrderStatus
  subtotal: number
  discount: number
  total: number
  clientId: number
  clientName: string
  items: OrderItem[]
}
