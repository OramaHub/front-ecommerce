import { R2_BASE } from "../constants/r2";

export function getProductFallbackImage(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes("americano")) return `${R2_BASE}/Americano.png`;
  if (name.includes("trucker")) return `${R2_BASE}/trucker-black.png`;
  if (name.includes("camiseta") || name.includes("camisa")) return `${R2_BASE}/t-short-black.png`;
  return `${R2_BASE}/black-cap.png`;
}
