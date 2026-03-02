import { useState, useRef } from "react"
import { Search, X, PowerOff, Power } from "lucide-react"
import { useAdminClients } from "../../hooks/useAdminClients"
import { ClientDetailsModal } from "../../components/admin/ClientDetailsModal"
import { Pagination } from "../../components/admin/Pagination"
import type { Client } from "../../types/client"

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-jakarta ${
      role === "ADMIN" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
    }`}>
      {role}
    </span>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-jakarta ${
      active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
    }`}>
      {active ? "Ativo" : "Inativo"}
    </span>
  )
}

export function AdminClientsPage() {
  const {
    clients,
    totalPages,
    totalElements,
    page,
    searchEmail,
    loading,
    error,
    setPage,
    search,
    clearSearch,
    toggleActive,
  } = useAdminClients()

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleToggle(e: React.MouseEvent, client: Client) {
    e.stopPropagation()
    setTogglingId(client.id)
    try {
      await toggleActive(client)
    } finally {
      setTogglingId(null)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const value = inputValue.trim()
    if (value) {
      search(value)
    }
  }

  function handleClear() {
    setInputValue("")
    clearSearch()
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold font-jakarta">Clientes</h1>
          {!loading && !searchEmail && (
            <p className="text-sm text-gray-500 font-jakarta mt-0.5">{totalElements} cliente(s)</p>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="email"
              placeholder="Buscar por email..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm font-jakarta focus:outline-none focus:border-black w-64"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-black text-white text-sm font-jakarta font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {searchEmail && (
        <div className="flex items-center gap-2 text-sm font-jakarta text-gray-600">
          <span>Resultado para: <strong>{searchEmail}</strong></span>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors"
          >
            <X size={14} />
            Limpar
          </button>
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-red-600 font-jakarta">{error}</p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-jakarta uppercase tracking-wide">Perfil</th>
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
                : clients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium font-jakarta text-black">{client.name}</p>
                          <p className="text-xs text-gray-400 font-jakarta">#{client.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-jakarta">{client.email}</td>
                      <td className="px-6 py-4">
                        <RoleBadge role={client.role} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge active={client.active} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => handleToggle(e, client)}
                          disabled={togglingId === client.id}
                          title={client.active ? "Desativar" : "Ativar"}
                          className={`p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                            client.active ? "text-red-400 hover:text-red-600" : "text-green-500 hover:text-green-700"
                          }`}
                        >
                          {client.active ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && clients.length === 0 && !error && (
            <p className="text-center text-sm text-gray-400 font-jakarta py-8">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>

      {!searchEmail && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  )
}
