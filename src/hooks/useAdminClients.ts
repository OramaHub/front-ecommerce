import { useState, useEffect } from "react"
import { getAllClients, getClientByEmail, activateClient, deactivateClient } from "../services/client-service"
import type { Client } from "../types/client"

interface UseAdminClientsReturn {
  clients: Client[]
  totalPages: number
  totalElements: number
  page: number
  searchEmail: string
  loading: boolean
  error: string | null
  setPage: (page: number) => void
  search: (email: string) => void
  clearSearch: () => void
  toggleActive: (client: Client) => Promise<void>
}

export function useAdminClients(): UseAdminClientsReturn {
  const [clients, setClients] = useState<Client[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (searchEmail.trim()) {
          const client = await getClientByEmail(searchEmail.trim())
          setClients([client])
          setTotalPages(1)
          setTotalElements(1)
        } else {
          const data = await getAllClients(page, 10)
          setClients(data.content)
          setTotalPages(data.totalPages)
          setTotalElements(data.totalElements)
        }
      } catch {
        setClients([])
        setTotalPages(0)
        setTotalElements(0)
        if (searchEmail.trim()) {
          setError("Nenhum cliente encontrado com esse email.")
        } else {
          setError("Não foi possível carregar os clientes.")
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, searchEmail, refreshKey])

  function search(email: string) {
    setSearchEmail(email)
    setPage(0)
  }

  function clearSearch() {
    setSearchEmail("")
    setPage(0)
  }

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function toggleActive(client: Client) {
    if (client.active) {
      await deactivateClient(client.id)
    } else {
      await activateClient(client.id)
    }
    refresh()
  }

  return {
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
  }
}
