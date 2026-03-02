import { useState } from "react"
import { Plus, Pencil, Images, PowerOff, Power } from "lucide-react"
import { useAdminProducts } from "../../hooks/useAdminProducts"
import { ProductFormModal } from "../../components/admin/ProductFormModal"
import { ProductImagesModal } from "../../components/admin/ProductImagesModal"
import { Pagination } from "../../components/admin/Pagination"
import type { AdminProduct } from "../../types/product"

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-jakarta ${
      active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
    }`}>
      {active ? "Ativo" : "Inativo"}
    </span>
  )
}

function StockBadge({ stock }: { stock: number }) {
  return (
    <span className={`text-sm font-jakarta font-medium ${stock === 0 ? "text-red-600" : "text-gray-800"}`}>
      {stock}
    </span>
  )
}

export function AdminProductsPage() {
  const {
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
  } = useAdminProducts()

  const [formProduct, setFormProduct] = useState<AdminProduct | null | undefined>(undefined)
  const [imagesProduct, setImagesProduct] = useState<AdminProduct | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const isFormOpen = formProduct !== undefined

  async function handleToggle(product: AdminProduct) {
    setTogglingId(product.id)
    try {
      await toggleActive(product)
    } finally {
      setTogglingId(null)
    }
  }

  if (error) {
    return <p className="text-sm text-red-600 font-jakarta">{error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-jakarta">Produtos</h1>
          {!loading && (
            <p className="text-sm text-gray-500 font-jakarta mt-0.5">{totalElements} produto(s)</p>
          )}
        </div>
        <button
          onClick={() => setFormProduct(null)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-jakarta font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Produto</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Preço</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Estoque</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium font-jakarta text-black">{product.name}</p>
                            <p className="text-xs text-gray-400 font-jakarta">#{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-jakarta text-gray-800">
                        {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge active={product.active} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setFormProduct(product)}
                            title="Editar"
                            className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setImagesProduct(product)}
                            title="Gerenciar imagens"
                            className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Images size={16} />
                          </button>
                          <button
                            onClick={() => handleToggle(product)}
                            disabled={togglingId === product.id}
                            title={product.active ? "Desativar" : "Ativar"}
                            className={`p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                              product.active ? "text-red-400 hover:text-red-600" : "text-green-500 hover:text-green-700"
                            }`}
                          >
                            {product.active ? <PowerOff size={16} /> : <Power size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && products.length === 0 && (
            <p className="text-center text-sm text-gray-400 font-jakarta py-8">Nenhum produto encontrado.</p>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {isFormOpen && (
        <ProductFormModal
          product={formProduct ?? null}
          onClose={() => setFormProduct(undefined)}
          onCreate={createProduct}
          onUpdate={updateProduct}
        />
      )}

      {imagesProduct && (
        <ProductImagesModal
          product={imagesProduct}
          onClose={() => setImagesProduct(null)}
          onAdd={addImage}
          onRemove={removeImage}
        />
      )}
    </div>
  )
}
