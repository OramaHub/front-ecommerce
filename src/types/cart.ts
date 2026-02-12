export interface CartItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Cart {
  id: number
  sessionId: string
  clientId: number
  clientName: string
  items: CartItem[]
  total: number
  createdAt: string
  updatedAt: string
}
