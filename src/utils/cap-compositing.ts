export type Zone = "front" | "mesh" | "brim" | "brimLining"

export interface ZoneConfig {
  zone: Zone
  imageUrl: string
  color: string
}

const DEFAULT_COLOR = "#E5E7EB"

const imageCache = new Map<string, HTMLImageElement>()

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => reject(new Error(`Failed to load: ${src}`))
    img.src = src
  })
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0,
    s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function applyColorToZone(
  partImage: HTMLImageElement,
  color: string,
  width: number,
  height: number
): HTMLCanvasElement {
  const temp = document.createElement("canvas")
  temp.width = width
  temp.height = height
  const ctx = temp.getContext("2d")!

  ctx.drawImage(partImage, 0, 0, width, height)

  if (color && color !== DEFAULT_COLOR && color.length === 7) {
    const hsl = hexToHSL(color)

    ctx.globalCompositeOperation = "color"
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    if (hsl.l < 45) {
      ctx.globalCompositeOperation = "multiply"
      const intensity = 1 - hsl.l / 45
      ctx.fillStyle = `rgba(0,0,0,${intensity * 0.65})`
      ctx.fillRect(0, 0, width, height)
    } else if (hsl.l > 60) {
      ctx.globalCompositeOperation = "screen"
      const intensity = (hsl.l - 60) / 40
      ctx.fillStyle = `rgba(255,255,255,${intensity * 0.55})`
      ctx.fillRect(0, 0, width, height)
    }

    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(partImage, 0, 0, width, height)
  }

  return temp
}

export async function renderCapComposite(
  zones: ZoneConfig[],
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, width, height)

  for (const z of zones) {
    try {
      const img = await loadImage(z.imageUrl)
      const colored = applyColorToZone(img, z.color, width, height)
      ctx.drawImage(colored, 0, 0)
    } catch {
      // Skip zones that fail to load
    }
  }

  return canvas
}

export async function renderCapCompositeDataUrl(
  zones: ZoneConfig[],
  width: number,
  height: number
): Promise<string> {
  const canvas = await renderCapComposite(zones, width, height)
  return canvas.toDataURL("image/png")
}
