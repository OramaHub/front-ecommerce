export function getProductFallbackImage(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes("americano")) return "/images/products/Americano.png";
  if (name.includes("trucker")) return "/images/products/trucker-black.png";
  if (name.includes("camiseta") || name.includes("camisa")) return "/images/products/t-short-black.png";
  return "/images/products/black-cap.png";
}
