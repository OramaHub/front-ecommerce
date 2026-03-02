import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { getClient } from "../../services/client-service"
import type { Client, ClientDetail } from "../../types/client"

interface ClientDetailsModalProps {
  client: Client
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">{label}</span>
      <span className="text-sm font-jakarta text-gray-900">{value || "—"}</span>
    </div>
  )
}

export function ClientDetailsModal({ client, onClose }: ClientDetailsModalProps) {
  const [detail, setDetail] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getClient(String(client.id))
        setDetail(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [client.id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold font-jakarta">Detalhes do cliente</h2>
            <p className="text-xs text-gray-500 font-jakarta mt-0.5">#{client.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <DetailRow label="Nome" value={detail?.name ?? client.name} />
              </div>
              <div className="col-span-2">
                <DetailRow label="Email" value={detail?.email ?? client.email} />
              </div>
              <DetailRow label="Telefone" value={detail?.phone ?? ""} />
              <DetailRow label="CPF" value={detail?.cpf ?? ""} />
              <DetailRow label="Perfil" value={client.role} />
              <DetailRow label="Status" value={client.active ? "Ativo" : "Inativo"} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
