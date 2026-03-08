import { useState } from "react"
import type { LogoDetail, LogoPosition, LogoTechnique, StrapType } from "../../types/custom-order"

const LOGO_POSITIONS: { value: LogoPosition; label: string; icon: string }[] = [
  { value: "FRENTE", label: "Frente", icon: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" },
  { value: "LATERAL_ESQUERDA", label: "Lat. Esquerda", icon: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" },
  { value: "LATERAL_DIREITA", label: "Lat. Direita", icon: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" },
  { value: "TRASEIRA", label: "Traseira", icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" },
  { value: "FORRO_ABA", label: "Forro da Aba", icon: "M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" },
]

const LOGO_TECHNIQUES: { value: LogoTechnique; label: string; desc: string }[] = [
  { value: "BORDADO", label: "Bordado", desc: "Acabamento clássico e durável" },
  { value: "SILK", label: "Silk", desc: "Impressão precisa e detalhada" },
  { value: "SUBLIMACAO", label: "Sublimação", desc: "Cores vibrantes e alta definição" },
  { value: "APLIK_LASER", label: "Aplik Laser", desc: "Recorte a laser com aplicação" },
  { value: "APLIK_SILK", label: "Aplik Silk", desc: "Aplicação com serigrafia" },
  { value: "APLIK_SUBLIMADO", label: "Aplik Sublimado", desc: "Aplicação sublimada" },
  { value: "GRAVADO_LASER", label: "Gravado a Laser", desc: "Gravação precisa no tecido" },
]

const STRAP_TYPES: { value: StrapType; label: string; desc: string; icon: string }[] = [
  { value: "PLASTICO", label: "Plástico", desc: "Fecho snap com ajuste rápido", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" },
  { value: "PANO", label: "Pano", desc: "Fita de pano com fivela metálica", icon: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75" },
]

interface DetailsSelectorProps {
  logoDetails: LogoDetail[]
  strapType: StrapType
  laserCut: boolean
  fullLaserCut: boolean
  quantity: number
  observations: string
  onChange: (field: string, value: unknown) => void
}

export function DetailsSelector({
  logoDetails,
  strapType,
  laserCut,
  fullLaserCut,
  quantity,
  observations,
  onChange,
}: DetailsSelectorProps) {
  const [expandedLogo, setExpandedLogo] = useState<number | null>(null)

  const addLogoDetail = () => {
    const usedPositions = logoDetails.map((d) => d.position)
    const nextPosition = LOGO_POSITIONS.find((p) => !usedPositions.includes(p.value))
    if (!nextPosition) return
    const newIndex = logoDetails.length
    onChange("logoDetails", [...logoDetails, { position: nextPosition.value, technique: "BORDADO" as LogoTechnique }])
    setExpandedLogo(newIndex)
  }

  const removeLogoDetail = (index: number) => {
    onChange("logoDetails", logoDetails.filter((_, i) => i !== index))
    setExpandedLogo(null)
  }

  const updateLogoDetail = (index: number, field: keyof LogoDetail, value: string) => {
    const updated = logoDetails.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    onChange("logoDetails", updated)
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
              Aplicação
            </span>
            <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em]">
              Detalhes da Logo
            </h3>
          </div>
          {logoDetails.length < LOGO_POSITIONS.length && (
            <button
              onClick={addLogoDetail}
              className="group h-[2.5rem] px-4 flex items-center gap-2 rounded-full border border-gray-200 font-jakarta text-[0.75rem] font-medium hover:border-black transition-all duration-300 cursor-pointer active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Adicionar posição</span>
              <span className="sm:hidden">Adicionar</span>
            </button>
          )}
        </div>

        {logoDetails.length === 0 ? (
          <button
            onClick={addLogoDetail}
            className="w-full group p-6 md:p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-black transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3 group-hover:bg-black transition-all duration-300">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="font-jakarta font-medium text-[0.8125rem] text-gray-600">
              Adicionar posição de logo
            </p>
            <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-1">
              Defina onde e como sua logo será aplicada
            </p>
          </button>
        ) : (
          <div className="space-y-3">
            {logoDetails.map((detail, index) => {
              const isExpanded = expandedLogo === index
              const posLabel = LOGO_POSITIONS.find((p) => p.value === detail.position)?.label || ""
              const techLabel = LOGO_TECHNIQUES.find((t) => t.value === detail.technique)?.label || ""

              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 ${isExpanded ? "border-black bg-[#FAFAFA]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                >
                  <button
                    onClick={() => setExpandedLogo(isExpanded ? null : index)}
                    className="w-full flex items-center gap-3 px-4 md:px-5 py-4 cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isExpanded ? "bg-black" : "bg-[#F5F5F5]"}`}>
                      <span className={`font-jakarta font-bold text-[0.75rem] ${isExpanded ? "text-white" : "text-gray-500"}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-jakarta font-medium text-[0.8125rem] truncate">{posLabel}</p>
                      <p className="font-jakarta text-[0.6875rem] text-gray-400 truncate">{techLabel}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-5 space-y-4 animate-[studioFadeUp_0.25s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="h-px bg-gray-200" />

                      <div>
                        <label className="font-jakarta text-[0.625rem] text-gray-400 uppercase tracking-[0.12em] mb-2.5 block">
                          Posição
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {LOGO_POSITIONS.map((p) => {
                            const isActive = detail.position === p.value
                            return (
                              <button
                                key={p.value}
                                onClick={() => updateLogoDetail(index, "position", p.value)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left font-jakarta text-[0.75rem] transition-all duration-200 cursor-pointer ${isActive
                                  ? "bg-black text-white"
                                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                                  }`}
                              >
                                <svg className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white/70" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                                </svg>
                                <span className="truncate">{p.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="font-jakarta text-[0.625rem] text-gray-400 uppercase tracking-[0.12em] mb-2.5 block">
                          Técnica de aplicação
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {LOGO_TECHNIQUES.map((t) => {
                            const isActive = detail.technique === t.value
                            return (
                              <button
                                key={t.value}
                                onClick={() => updateLogoDetail(index, "technique", t.value)}
                                className={`flex flex-col px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${isActive
                                  ? "bg-black text-white"
                                  : "bg-white border border-gray-200 hover:border-gray-400"
                                  }`}
                              >
                                <span className={`font-jakarta font-medium text-[0.75rem] ${isActive ? "text-white" : "text-gray-700"}`}>
                                  {t.label}
                                </span>
                                <span className={`font-jakarta text-[0.625rem] mt-0.5 ${isActive ? "text-white/60" : "text-gray-400"}`}>
                                  {t.desc}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => removeLogoDetail(index)}
                        className="flex items-center gap-1.5 font-jakarta text-[0.6875rem] text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remover posição
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
          Fecho traseiro
        </span>
        <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em] mb-5">
          Ataca
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STRAP_TYPES.map((strap) => {
            const isActive = strapType === strap.value
            return (
              <button
                key={strap.value}
                onClick={() => onChange("strapType", strap.value)}
                className={`group relative flex items-start gap-4 p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left ${isActive
                  ? "border-black bg-[#FAFAFA]"
                  : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-black rounded-full flex items-center justify-center animate-[checkReveal_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? "bg-black" : "bg-[#F5F5F5] group-hover:bg-[#EBEBEB]"}`}>
                  <svg className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={strap.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-jakarta font-semibold text-[0.875rem]">{strap.label}</p>
                  <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-0.5">{strap.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
          Acabamento
        </span>
        <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em] mb-5">
          Corte a Laser
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => onChange("laserCut", !laserCut)}
            className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left ${laserCut ? "border-black bg-[#FAFAFA]" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${laserCut ? "border-black bg-black" : "border-gray-300"}`}>
              {laserCut && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-jakarta font-medium text-[0.8125rem]">Furado a laser</p>
              <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-0.5">Furos a laser nas laterais para ventilação</p>
            </div>
          </button>
          <button
            onClick={() => onChange("fullLaserCut", !fullLaserCut)}
            className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left ${fullLaserCut ? "border-black bg-[#FAFAFA]" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${fullLaserCut ? "border-black bg-black" : "border-gray-300"}`}>
              {fullLaserCut && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-jakarta font-medium text-[0.8125rem]">Furado a laser completo</p>
              <p className="font-jakarta text-[0.6875rem] text-gray-400 mt-0.5">Furos a laser em toda a estrutura do boné</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
          Pedido
        </span>
        <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em] mb-5">
          Quantidade
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => quantity > 1 && onChange("quantity", quantity - 1)}
            className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center font-jakarta font-medium text-[1rem] hover:border-black transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (v >= 1) onChange("quantity", v)
            }}
            className="w-20 h-12 text-center border border-gray-200 rounded-xl font-jakarta font-semibold text-[1rem] focus:outline-none focus:border-black transition-colors"
          />
          <button
            onClick={() => onChange("quantity", quantity + 1)}
            className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center font-jakarta font-medium text-[1rem] hover:border-black transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <span className="font-jakarta text-[0.75rem] text-gray-400 ml-3">
            {quantity === 1 ? "unidade" : "unidades"}
          </span>
        </div>
      </div>

      <div>
        <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
          Informações adicionais
        </span>
        <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em] mb-5">
          Observações
        </h3>
        <div className="relative">
          <textarea
            value={observations}
            onChange={(e) => onChange("observations", e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Detalhes sobre cores, posicionamento, referências..."
            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl font-jakarta text-[0.8125rem] focus:outline-none focus:border-black resize-none transition-colors leading-relaxed"
          />
          <span className="absolute bottom-3 right-4 font-jakarta text-[0.625rem] text-gray-300">
            {observations.length}/2000
          </span>
        </div>
      </div>
    </div>
  )
}
