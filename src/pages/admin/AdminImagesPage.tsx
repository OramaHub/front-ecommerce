import { useRef, useState } from "react"
import { Upload, Trash2, Copy, Check, ImageOff } from "lucide-react"
import { useAdminMedia } from "../../hooks/useAdminMedia"
import { Pagination } from "../../components/admin/Pagination"

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      title="Copiar URL"
      className="p-1.5 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  )
}

export function AdminImagesPage() {
  const { media, totalPages, page, loading, uploading, error, setPage, upload, remove } =
    useAdminMedia()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError(null)
    try {
      for (const file of Array.from(files)) {
        await upload(file)
      }
    } catch {
      setUploadError("Falha ao enviar uma ou mais imagens.")
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemove(id: number) {
    setRemovingId(id)
    try {
      await remove(id)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-jakarta">Biblioteca de Imagens</h1>
          {!loading && (
            <p className="text-sm text-gray-500 font-jakarta mt-0.5">
              {media.length} imagem(ns) nesta página
            </p>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-jakarta font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <Upload size={16} />
            {uploading ? "Enviando..." : "Upload"}
          </button>
        </div>
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-red-600 font-jakarta">{error ?? uploadError}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ImageOff size={40} className="text-gray-300 mb-3" />
          <p className="text-sm font-jakarta text-gray-400">Nenhuma imagem na biblioteca.</p>
          <p className="text-xs font-jakarta text-gray-400 mt-1">
            Clique em "Upload" para adicionar imagens.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((img) => (
            <div
              key={img.id}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                <img
                  src={img.url}
                  alt={img.filename}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.2"
                  }}
                />
              </div>

              <div className="px-2 py-1.5 border-t border-gray-100">
                <p className="text-[10px] font-jakarta text-gray-500 truncate">{img.filename}</p>
              </div>

              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton url={img.url} />
                <button
                  onClick={() => handleRemove(img.id)}
                  disabled={removingId === img.id}
                  title="Remover"
                  className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-white disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
