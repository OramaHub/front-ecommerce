import { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react"
import * as fabric from "fabric"
import { ZONE_IMAGES, type Zone } from "../../constants/cap-zones"
import { useCapCanvas } from "../../hooks/useCapCanvas"

export interface LogoEditorHandle {
  getLogoFile: () => File | null
  getExportDataUrl: () => string | null
}

interface LogoEditorProps {
  model: string
  colorFront: string
  colorMesh: string
  colorBrim: string
  colorBrimLining: string
  showTools: boolean
}

type Tool = "upload" | "text" | "layers"

const FONTS = [
  "Inter", "Roboto", "Playfair Display", "Montserrat",
  "Bebas Neue", "Oswald", "Poppins", "Raleway",
]

const BG_SIZE = 1024

export const LogoEditor = forwardRef<LogoEditorHandle, LogoEditorProps>(function LogoEditor({
  model, colorFront, colorMesh, colorBrim, colorBrimLining, showTools,
}, ref) {
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedFileRef = useRef<File | null>(null)

  useImperativeHandle(ref, () => ({
    getLogoFile: () => uploadedFileRef.current,
    getExportDataUrl: () => {
      if (!fabricRef.current) return null
      try {
        return fabricRef.current.toDataURL({ format: "png", multiplier: 2 })
      } catch {
        return null
      }
    },
  }), [])

  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)
  const [objects, setObjects] = useState<fabric.FabricObject[]>([])

  const [textValue, setTextValue] = useState("Sua marca")
  const [textFont, setTextFont] = useState("Inter")
  const [textColor, setTextColor] = useState("#000000")
  const [textSize, setTextSize] = useState(48)

  const images = ZONE_IMAGES[model] || ZONE_IMAGES.TRUCKER_TELA || {}
  const colorMap: Record<Zone, string> = {
    front: colorFront,
    mesh: colorMesh,
    brim: colorBrim,
    brimLining: colorBrimLining,
  }

  const zones = useMemo(
    () =>
      (["brimLining", "brim", "mesh", "front"] as Zone[])
        .filter((z) => images[z])
        .map((z) => ({ zone: z, imageUrl: images[z]!, color: colorMap[z] })),
    [images, colorFront, colorMesh, colorBrim, colorBrimLining]
  )

  const { canvasRef: bgCanvasRef } = useCapCanvas({
    zones,
    width: BG_SIZE,
    height: BG_SIZE,
  })

  const syncObjects = useCallback(() => {
    if (!fabricRef.current) return
    setObjects([...fabricRef.current.getObjects()])
  }, [])


  useEffect(() => {
    if (!fabricCanvasRef.current || fabricRef.current) return

    const container = containerRef.current
    if (!container) return
    const size = Math.min(800, container.offsetWidth - 32)

    const canvas = new fabric.Canvas(fabricCanvasRef.current, {
      width: size,
      height: size,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
    })

    fabricRef.current = canvas

    canvas.on("selection:created", (e: { selected?: fabric.FabricObject[] }) => {
      setSelectedObject(e.selected?.[0] ?? null)
    })
    canvas.on("selection:updated", (e: { selected?: fabric.FabricObject[] }) => {
      setSelectedObject(e.selected?.[0] ?? null)
    })
    canvas.on("selection:cleared", () => setSelectedObject(null))
    canvas.on("object:added", () => syncObjects())
    canvas.on("object:removed", () => syncObjects())
    canvas.on("object:modified", () => syncObjects())

    const handleResize = () => {
      if (!containerRef.current) return
      const newSize = Math.min(800, containerRef.current.offsetWidth - 32)
      canvas.setDimensions({ width: newSize, height: newSize })
      canvas.renderAll()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [syncObjects])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    if (showTools) {
      canvas.selection = true
      canvas.forEachObject((obj: fabric.FabricObject) => {
        obj.selectable = true
        obj.evented = true
      })
    } else {
      canvas.discardActiveObject()
      canvas.selection = false
      canvas.forEachObject((obj: fabric.FabricObject) => {
        obj.selectable = false
        obj.evented = false
      })
    }
    canvas.renderAll()
  }, [showTools])

  const handleUpload = (file: File) => {
    uploadedFileRef.current = file
    const canvas = fabricRef.current
    if (!canvas) return
    const url = URL.createObjectURL(file)
    fabric.FabricImage.fromURL(url).then((img: fabric.FabricImage) => {
      const maxW = canvas.width! * 0.4
      const maxH = canvas.height! * 0.3
      const scale = Math.min(maxW / img.width!, maxH / img.height!)
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.width! / 2,
        top: canvas.height! * 0.35,
        originX: "center",
        originY: "center",
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      setActiveTool(null)
    })
  }

  const addText = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const text = new fabric.IText(textValue, {
      fontFamily: textFont,
      fill: textColor,
      fontSize: textSize,
      left: canvas.width! / 2,
      top: canvas.height! * 0.35,
      originX: "center",
      originY: "center",
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
    setActiveTool(null)
  }

  const deleteSelected = () => {
    const canvas = fabricRef.current
    if (!canvas || !selectedObject) return
    canvas.remove(selectedObject)
    setSelectedObject(null)
    canvas.renderAll()
  }

  const bringForward = () => {
    if (!fabricRef.current || !selectedObject) return
    fabricRef.current.bringObjectForward(selectedObject)
    syncObjects()
    fabricRef.current.renderAll()
  }
  const sendBackward = () => {
    if (!fabricRef.current || !selectedObject) return
    fabricRef.current.sendObjectBackwards(selectedObject)
    syncObjects()
    fabricRef.current.renderAll()
  }

  const toolItems: { id: Tool; label: string; iconPath: string }[] = [
    {
      id: "upload",
      label: "Upload",
      iconPath: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
    },
    {
      id: "text",
      label: "Texto",
      iconPath: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12",
    },
    {
      id: "layers",
      label: "Layers",
      iconPath: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25",
    },
  ]

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="bg-[#FAFAFA] rounded-3xl overflow-hidden relative">
        <div className="aspect-square max-h-[520px] mx-auto flex items-center justify-center p-4 md:p-6">
          <div className="relative w-full h-full">
            <canvas
              ref={bgCanvasRef}
              className="absolute inset-0 w-full h-full rounded-2xl transition-transform duration-500"
              style={{
                imageRendering: "auto",
                transform: showTools ? "scale(1.35)" : "scale(1)",
                transformOrigin: "center 40%",
              }}
            />
            <canvas
              ref={fabricCanvasRef}
              className="relative w-full h-full rounded-2xl"
              style={{ imageRendering: "auto" }}
            />
          </div>

          {showTools && objects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={() => { setActiveTool("upload"); fileInputRef.current?.click() }}
                className="pointer-events-auto group flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-jakarta font-semibold text-[0.875rem] text-black">
                    Adicione sua logo
                  </p>
                  <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-0.5">
                    Arraste ou clique para enviar
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {showTools && selectedObject && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 z-10">
            <button onClick={bringForward} title="Trazer para frente" className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button onClick={sendBackward} title="Enviar para trás" className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="w-px h-5 bg-gray-200 mx-0.5" />
            {selectedObject instanceof fabric.IText && (
              <>
                <input
                  type="color"
                  value={(selectedObject.fill as string) || "#000000"}
                  onChange={(e) => { selectedObject.set("fill", e.target.value); fabricRef.current?.renderAll() }}
                  className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <div className="w-px h-5 bg-gray-200 mx-0.5" />
              </>
            )}
            <button onClick={deleteSelected} title="Excluir" className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {showTools && (
        <>
          <div className="flex items-center gap-1 p-1 bg-[#F5F5F5] rounded-2xl">
            {toolItems.map((tool) => {
              const isActive = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(isActive ? null : tool.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-jakarta text-[0.75rem] font-medium transition-all duration-300 cursor-pointer ${isActive
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tool.iconPath} />
                  </svg>
                  <span>{tool.label}</span>
                </button>
              )
            })}
          </div>

          {activeTool === "upload" && (
            <div className="animate-[studioFadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 md:p-10 text-center cursor-pointer hover:border-gray-400 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="font-jakarta font-medium text-[0.8125rem] text-gray-700">
                  Arraste sua logo ou clique para enviar
                </p>
                <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-1">
                  PNG, JPG, SVG ou WebP
                </p>
              </div>
            </div>
          )}

          {activeTool === "text" && (
            <div className="animate-[studioFadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
              <div className="p-4 bg-[#FAFAFA] rounded-2xl space-y-3">
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Digite o texto..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-jakarta text-[0.8125rem] focus:outline-none focus:border-black transition-colors"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-jakarta text-[0.5625rem] text-gray-400 uppercase tracking-[0.1em] mb-1.5 block">Fonte</label>
                    <select
                      value={textFont}
                      onChange={(e) => setTextFont(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-jakarta text-[0.75rem] focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                    >
                      {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-jakarta text-[0.5625rem] text-gray-400 uppercase tracking-[0.1em] mb-1.5 block">Tamanho</label>
                    <input
                      type="number"
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      min={8}
                      max={200}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-jakarta text-[0.75rem] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-jakarta text-[0.5625rem] text-gray-400 uppercase tracking-[0.1em] mb-1.5 block">Cor</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                    />
                    <span className="font-jakarta text-[0.6875rem] font-mono text-gray-400">{textColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={addText}
                className="w-full py-3 bg-black text-white rounded-xl font-jakarta text-[0.75rem] font-semibold tracking-[0.04em] hover:bg-gray-900 transition-colors cursor-pointer active:scale-[0.98]"
              >
                Adicionar texto
              </button>
            </div>
          )}

          {activeTool === "layers" && (
            <div className="animate-[studioFadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              {objects.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75" />
                    </svg>
                  </div>
                  <p className="font-jakarta text-[0.8125rem] text-gray-400">Nenhum elemento adicionado</p>
                  <p className="font-jakarta text-[0.6875rem] text-gray-300 mt-0.5">Faça upload de uma logo ou adicione texto</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {objects.map((obj, i) => {
                    const isSelected = selectedObject === obj
                    const label = obj instanceof fabric.IText
                      ? `"${(obj as fabric.IText).text?.slice(0, 20) || ""}"`
                      : `Imagem ${i + 1}`
                    const type = obj instanceof fabric.IText ? "T" : null

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          fabricRef.current?.setActiveObject(obj)
                          fabricRef.current?.renderAll()
                          setSelectedObject(obj)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${isSelected
                          ? "bg-black text-white"
                          : "bg-[#FAFAFA] hover:bg-gray-100"
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-white"
                          }`}>
                          {type ? (
                            <span className={`font-jakarta font-bold text-[0.75rem] ${isSelected ? "text-white" : "text-gray-600"}`}>T</span>
                          ) : (
                            <svg className={`w-4 h-4 ${isSelected ? "text-white/70" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" />
                            </svg>
                          )}
                        </div>
                        <span className="font-jakarta text-[0.75rem] font-medium truncate flex-1">{label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
        className="hidden"
      />
    </div>
  )
})
