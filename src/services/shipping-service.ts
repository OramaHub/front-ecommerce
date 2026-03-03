import api from "./api"
import type { ShippingResponse } from "../types/shipping"

export async function calculateShipping(zipCode: string): Promise<ShippingResponse> {
  const { data } = await api.post<ShippingResponse>("/api/shipping/calculate", { zipCode })
  return data
}
