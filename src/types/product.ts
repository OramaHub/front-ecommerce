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

export interface AdminProduct extends Product {
  active: boolean
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stock: number
}

export interface UpdateProductRequest {
  name: string
  description: string
  price: number
}
