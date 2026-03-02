export interface Client {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

export interface ClientDetail extends Client {
  phone: string
  cpf: string
}
