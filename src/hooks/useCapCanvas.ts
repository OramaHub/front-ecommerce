import { useRef, useEffect, useCallback, useState } from "react"
import { renderCapComposite, type ZoneConfig } from "../utils/cap-compositing"

interface UseCapCanvasOptions {
  zones: ZoneConfig[]
  width: number
  height: number
  onSnapshot?: (dataUrl: string) => void
}

export function useCapCanvas({ zones, width, height, onSnapshot }: UseCapCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const composite = await renderCapComposite(zones, width, height)
    ctx.drawImage(composite, 0, 0)

    if (!ready) setReady(true)

    if (onSnapshot) {
      try {
        onSnapshot(canvas.toDataURL("image/png"))
      } catch {
        // Canvas tainted — skip snapshot
      }
    }
  }, [zones, width, height, ready, onSnapshot])

  useEffect(() => {
    render()
  }, [render])

  return { canvasRef, ready }
}
