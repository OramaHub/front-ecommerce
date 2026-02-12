export interface ProductImage {
  id: number
  url: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  images: ProductImage[]
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}
