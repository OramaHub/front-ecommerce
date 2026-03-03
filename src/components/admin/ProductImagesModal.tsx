import { useState, useEffect, useRef } from "react"
import { X, Upload, ImageOff, Check } from "lucide-react"
import type { AdminProduct, ProductImage } from "../../types/product"
import type { MediaImage } from "../../types/media"
import { getMedia, uploadMedia } from "../../services/media-service"

interface ProductImagesModalProps {
  product: AdminProduct
  onClose: () => void
  onAdd: (productId: number, url: string) => Promise<void>
  onRemove: (productId: number, imageId: number) => Promise<void>
}

export function ProductImagesModal({ product, onClose, onAdd, onRemove }: ProductImagesModalProps) {
  const [images, setImages] = useState<ProductImage[]>(product.images)
  const [library, setLibrary] = useState<MediaImage[]>([])
  const [libraryPage, setLibraryPage] = useState(0)
  const [libraryTotalPages, setLibraryTotalPages] = useState(0)
  const [libraryLoading, setLibraryLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const assignedUrls = new Set(images.map((img) => img.url))

  useEffect(() => {
    fetchLibrary(libraryPage)
  }, [libraryPage])

  async function fetchLibrary(p: number) {
    setLibraryLoading(true)
    try {
      const data = await getMedia(p, 20)
      setLibrary(data.content)
      setLibraryTotalPages(data.totalPages)
    } catch {
      setError("Erro ao carregar biblioteca.")
    } finally {
      setLibraryLoading(false)
    }
  }

  async function handleSelect(mediaImg: MediaImage) {
    if (assignedUrls.has(mediaImg.url)) return
    setError(null)
    setAddingId(mediaImg.id)
    try {
      await onAdd(product.id, mediaImg.url)
      setImages((prev) => [...prev, { id: Date.now(), url: mediaImg.url }])
    } catch {
      setError("Não foi possível adicionar a imagem.")
    } finally {
      setAddingId(null)
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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file)
      }
      await fetchLibrary(0)
      setLibraryPage(0)
    } catch {
      setError("Falha ao enviar imagem.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold font-jakarta">Imagens do produto</h2>
            <p className="text-xs text-gray-500 font-jakarta mt-0.5 truncate max-w-sm">
              {product.name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-5 pb-4">
            <p className="text-xs font-semibold font-jakarta text-gray-400 uppercase tracking-wider mb-3">
              Imagens do produto
            </p>
            {images.length === 0 ? (
              <p className="text-sm font-jakarta text-gray-400 py-2">Nenhuma imagem adicionada.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group w-20 h-20 shrink-0">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg border border-gray-200 bg-gray-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.3"
                      }}
                    />
                    <button
                      onClick={() => handleRemove(img.id)}
                      disabled={removingId === img.id}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-50 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-6 pt-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold font-jakarta text-gray-400 uppercase tracking-wider">
                Biblioteca de imagens
              </p>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-jakarta font-medium hover:border-black hover:text-black disabled:opacity-50 transition-colors"
                >
                  <Upload size={13} />
                  {uploading ? "Enviando..." : "Upload"}
                </button>
              </div>
            </div>

            {libraryLoading ? (
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : library.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ImageOff size={32} className="text-gray-300 mb-2" />
                <p className="text-sm font-jakarta text-gray-400">Biblioteca vazia.</p>
                <p className="text-xs font-jakarta text-gray-400 mt-0.5">
                  Faça upload de imagens para começar.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-5 gap-3">
                  {library.map((img) => {
                    const isAssigned = assignedUrls.has(img.url)
                    const isAdding = addingId === img.id
                    return (
                      <button
                        key={img.id}
                        onClick={() => handleSelect(img)}
                        disabled={isAssigned || isAdding}
                        title={img.filename}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          isAssigned
                            ? "border-black opacity-50 cursor-default"
                            : "border-transparent hover:border-black cursor-pointer"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.filename}
                          className="w-full h-full object-cover bg-gray-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0.2"
                          }}
                        />
                        {isAssigned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check size={18} className="text-white" />
                          </div>
                        )}
                        {isAdding && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {libraryTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      onClick={() => setLibraryPage((p) => p - 1)}
                      disabled={libraryPage === 0}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-jakarta hover:border-black disabled:opacity-40 transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-xs font-jakarta text-gray-500">
                      {libraryPage + 1} / {libraryTotalPages}
                    </span>
                    <button
                      onClick={() => setLibraryPage((p) => p + 1)}
                      disabled={libraryPage + 1 >= libraryTotalPages}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-jakarta hover:border-black disabled:opacity-40 transition-colors"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 border-t border-gray-100 shrink-0">
            <p className="text-sm text-red-600 font-jakarta">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
