import { useState, useEffect } from "react"
import {
  getAllProductsAdmin,
  createProduct as createProductService,
  updateProduct as updateProductService,
  activateProduct,
  deactivateProduct,
  setProductStock,
  addProductImage,
  deleteProductImage,
} from "../services/product-service"
import type { AdminProduct, CreateProductRequest, UpdateProductRequest } from "../types/product"

interface UseAdminProductsReturn {
  products: AdminProduct[]
  totalPages: number
  totalElements: number
  page: number
  loading: boolean
  error: string | null
  setPage: (page: number) => void
  createProduct: (data: CreateProductRequest) => Promise<void>
  updateProduct: (id: number, data: UpdateProductRequest, newStock?: number) => Promise<void>
  toggleActive: (product: AdminProduct) => Promise<void>
  addImage: (productId: number, url: string) => Promise<void>
  removeImage: (productId: number, imageId: number) => Promise<void>
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllProductsAdmin(page, 10)
        setProducts(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      } catch {
        setError("Não foi possível carregar os produtos.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, refreshKey])

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function createProduct(data: CreateProductRequest) {
    await createProductService(data)
    refresh()
  }

  async function updateProduct(id: number, data: UpdateProductRequest, newStock?: number) {
    await updateProductService(id, data)
    if (newStock !== undefined) {
      await setProductStock(id, newStock)
    }
    refresh()
  }

  async function toggleActive(product: AdminProduct) {
    if (product.active) {
      await deactivateProduct(product.id)
    } else {
      await activateProduct(product.id)
    }
    refresh()
  }

  async function addImage(productId: number, url: string) {
    await addProductImage(productId, url)
    refresh()
  }

  async function removeImage(productId: number, imageId: number) {
    await deleteProductImage(productId, imageId)
    refresh()
  }

  return {
    products,
    totalPages,
    totalElements,
    page,
    loading,
    error,
    setPage,
    createProduct,
    updateProduct,
    toggleActive,
    addImage,
    removeImage,
  }
}
