import { useState } from "react"
import { X, Trash2, Plus } from "lucide-react"
import type { AdminProduct, ProductImage } from "../../types/product"

interface ProductImagesModalProps {
  product: AdminProduct
  onClose: () => void
  onAdd: (productId: number, url: string) => Promise<void>
  onRemove: (productId: number, imageId: number) => Promise<void>
}

export function ProductImagesModal({ product, onClose, onAdd, onRemove }: ProductImagesModalProps) {
  const [images, setImages] = useState<ProductImage[]>(product.images)
  const [newUrl, setNewUrl] = useState("")
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    const url = newUrl.trim()
    if (!url) return

    setError(null)
    setAdding(true)
    try {
      await onAdd(product.id, url)
      setImages((prev) => [...prev, { id: Date.now(), url }])
      setNewUrl("")
    } catch {
      setError("Não foi possível adicionar a imagem.")
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(imageId: number) {
    setRemovingId(imageId)
    try {
      await onRemove(product.id, imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch {
      setError("Não foi possível remover a imagem.")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold font-jakarta">Imagens do produto</h2>
            <p className="text-xs text-gray-500 font-jakarta mt-0.5 truncate max-w-xs">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {images.length === 0 && (
              <p className="text-sm text-gray-400 font-jakarta text-center py-4">Nenhuma imagem cadastrada.</p>
            )}
            {images.map((img) => (
              <div key={img.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <img
                  src={img.url}
                  alt=""
                  className="w-12 h-12 object-cover rounded-md bg-gray-100 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <span className="flex-1 text-xs font-jakarta text-gray-600 truncate">{img.url}</span>
                <button
                  onClick={() => handleRemove(img.id)}
                  disabled={removingId === img.id}
                  className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newUrl.trim()}
              className="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-sm font-jakarta font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shrink-0"
            >
              <Plus size={16} />
              {adding ? "..." : "Adicionar"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 font-jakarta">{error}</p>}
        </div>
      </div>
    </div>
  )
}
