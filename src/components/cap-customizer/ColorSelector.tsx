import { useState } from "react"

type Zone = "front" | "mesh" | "brim" | "brimLining"

const ZONES: { key: Zone; formKey: string; label: string }[] = [
  { key: "front", formKey: "colorFront", label: "Frente" },
  { key: "mesh", formKey: "colorMesh", label: "Tela" },
  { key: "brim", formKey: "colorBrim", label: "Aba" },
  { key: "brimLining", formKey: "colorBrimLining", label: "Forro" },
]

const PALETTE = [
  { hex: "#000000" }, { hex: "#FFFFFF" }, { hex: "#1A1A2E" }, { hex: "#0F3460" },
  { hex: "#3498DB" }, { hex: "#1ABC9C" }, { hex: "#2ECC71" }, { hex: "#DAF7A6" },
  { hex: "#FFC300" }, { hex: "#F39C12" }, { hex: "#FF5733" }, { hex: "#E94560" },
  { hex: "#C70039" }, { hex: "#9B59B6" }, { hex: "#8B4513" }, { hex: "#A0522D" },
  { hex: "#D2691E" }, { hex: "#BDC3C7" }, { hex: "#7F8C8D" }, { hex: "#2C3E50" },
]

const NO_COLOR = "#E5E7EB"

interface ColorControlsProps {
  colorFront: string
  colorMesh: string
  colorBrim: string
  colorBrimLining: string
  onChange: (field: string, value: string) => void
}

export function ColorControls({
  colorFront,
  colorMesh,
  colorBrim,
  colorBrimLining,
  onChange,
}: ColorControlsProps) {
  const [activeZone, setActiveZone] = useState<Zone>("front")
  const [showCustom, setShowCustom] = useState(false)

  const colors: Record<string, string> = {
    colorFront,
    colorMesh,
    colorBrim,
    colorBrimLining,
  }

  const activeFormKey = ZONES.find((z) => z.key === activeZone)!.formKey
  const activeColor = colors[activeFormKey]
  const hasColor = activeColor !== NO_COLOR && activeColor.length === 7

  return (
    <div className="space-y-4">
      {/* Zone Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F5F5F5] rounded-2xl">
        {ZONES.map(({ key, formKey, label }) => {
          const isActive = key === activeZone
          const zoneColor = colors[formKey]
          const filled = zoneColor !== NO_COLOR && zoneColor.length === 7

          return (
            <button
              key={key}
              onClick={() => setActiveZone(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-jakarta text-[0.75rem] font-medium transition-all duration-300 cursor-pointer ${isActive
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${!filled ? "border border-gray-300 border-dashed" : ""
                  }`}
                style={{
                  backgroundColor: filled ? zoneColor : "transparent",
                  boxShadow: filled && zoneColor === "#FFFFFF" ? "inset 0 0 0 1px #d1d5db" : "none",
                }}
              />
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.08em]">
            Selecione a cor
          </p>
          {hasColor && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeColor }} />
              <span className="font-jakarta text-[0.6875rem] font-mono text-gray-500">{activeColor}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PALETTE.map(({ hex }) => {
            const isSelected = activeColor === hex
            const isLight = hex === "#FFFFFF" || hex === "#DAF7A6" || hex === "#BDC3C7" || hex === "#FFC300"
            return (
              <button
                key={hex}
                onClick={() => onChange(activeFormKey, hex)}
                title={hex}
                className={`w-9 h-9 rounded-full transition-all duration-200 cursor-pointer ${isSelected ? "ring-2 ring-black ring-offset-2 scale-110" : "hover:scale-110"
                  }`}
                style={{
                  backgroundColor: hex,
                  boxShadow: isLight ? "inset 0 0 0 1px rgba(0,0,0,0.08)" : "none",
                }}
              />
            )
          })}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`w-9 h-9 rounded-full border-2 border-dashed transition-all duration-200 cursor-pointer flex items-center justify-center ${showCustom ? "border-black" : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {showCustom && (
          <div className="flex items-center gap-3 mt-4 p-3 bg-[#FAFAFA] rounded-xl">
            <input
              type="color"
              value={activeColor === NO_COLOR ? "#000000" : activeColor}
              onChange={(e) => onChange(activeFormKey, e.target.value.toUpperCase())}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={activeColor === NO_COLOR ? "" : activeColor}
              placeholder="#000000"
              onChange={(e) => {
                const v = e.target.value.toUpperCase()
                if (/^#[0-9A-F]{0,6}$/.test(v)) onChange(activeFormKey, v)
              }}
              maxLength={7}
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-[0.8125rem] font-jakarta font-mono focus:outline-none focus:border-black transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  )
}
