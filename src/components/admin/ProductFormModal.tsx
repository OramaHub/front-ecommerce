import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { AdminProduct, CreateProductRequest, UpdateProductRequest } from "../../types/product"

interface ProductFormModalProps {
  product: AdminProduct | null
  onClose: () => void
  onCreate: (data: CreateProductRequest) => Promise<void>
  onUpdate: (id: number, data: UpdateProductRequest, newStock?: number) => Promise<void>
}

interface FormState {
  name: string
  description: string
  price: string
  stock: string
}

const emptyForm: FormState = { name: "", description: "", price: "", stock: "" }

function toFormState(product: AdminProduct): FormState {
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
  }
}

export function ProductFormModal({ product, onClose, onCreate, onUpdate }: ProductFormModalProps) {
  const isEditing = product !== null
  const [form, setForm] = useState<FormState>(isEditing ? toFormState(product) : emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm(isEditing ? toFormState(product) : emptyForm)
    setError(null)
  }, [product, isEditing])

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)

    if (!form.name.trim()) return setError("Nome é obrigatório.")
    if (isNaN(price) || price <= 0) return setError("Preço deve ser maior que zero.")
    if (isNaN(stock) || stock < 0) return setError("Estoque não pode ser negativo.")

    setSubmitting(true)
    try {
      if (isEditing) {
        const originalStock = product.stock
        await onUpdate(
          product.id,
          { name: form.name, description: form.description, price },
          stock !== originalStock ? stock : undefined,
        )
      } else {
        await onCreate({ name: form.name, description: form.description, price, stock })
      }
      onClose()
    } catch {
      setError("Ocorreu um erro ao salvar. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold font-jakarta">
            {isEditing ? "Editar produto" : "Novo produto"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium font-jakarta text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-jakarta text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium font-jakarta text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-jakarta text-gray-700 mb-1">Estoque</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-jakarta">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-jakarta text-gray-600 hover:text-black transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-jakarta font-medium bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
