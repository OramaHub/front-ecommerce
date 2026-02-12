import api from "./api"
import type { Product, PageResponse } from "../types/product"

export async function getProducts(page = 0, size = 12, sort = "price,asc") {
  const { data } = await api.get<PageResponse<Product>>("/api/products", {
    params: { page, size, sort },
  })
  return data
}

export async function getProductById(id: number) {
  const { data } = await api.get<Product>(`/api/products/${id}`)
  return data
}

export async function searchProducts(name: string, page = 0, size = 12) {
  const { data } = await api.get<PageResponse<Product>>("/api/products/name", {
    params: { name, page, size },
  })
  return data
}
