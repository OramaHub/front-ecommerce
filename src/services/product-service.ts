import api from "./api"
import type { Product, AdminProduct, ProductImage, CreateProductRequest, UpdateProductRequest } from "../types/product"
import type { PageResponse } from "../types/common"

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

export async function getAllProductsAdmin(page = 0, size = 10) {
  const { data } = await api.get<PageResponse<AdminProduct>>("/api/products/all", {
    params: { page, size },
  })
  return data
}

export async function createProduct(product: CreateProductRequest) {
  const { data } = await api.post<AdminProduct>("/api/products", product)
  return data
}

export async function updateProduct(id: number, product: UpdateProductRequest) {
  const { data } = await api.put<AdminProduct>(`/api/products/${id}`, product)
  return data
}

export async function activateProduct(id: number) {
  await api.patch(`/api/products/${id}/activate`)
}

export async function deactivateProduct(id: number) {
  await api.patch(`/api/products/${id}/deactivate`)
}

export async function setProductStock(id: number, newStockValue: number) {
  await api.patch(`/api/products/${id}/stock/set`, { newStockValue })
}

export async function addProductImage(productId: number, url: string) {
  const { data } = await api.post<ProductImage>(`/api/products/${productId}/images/single`, { url })
  return data
}

export async function deleteProductImage(productId: number, imageId: number) {
  await api.delete(`/api/products/${productId}/images/${imageId}`)
}
