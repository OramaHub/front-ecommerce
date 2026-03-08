import { useState, useEffect, useRef } from "react"
import { useNavigate, NavLink } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import { ColorControls } from "../components/cap-customizer/ColorSelector"
import { LogoEditor, type LogoEditorHandle } from "../components/cap-customizer/LogoEditor"
import { DetailsSelector } from "../components/cap-customizer/DetailsSelector"
import { OrderSummary } from "../components/cap-customizer/OrderSummary"
import { createCustomOrder, uploadLogo } from "../services/custom-order-service"
import type {
  CapModel,
  CapLine,
  CapMaterial,
  StrapType,
  LogoDetail,
  CreateCustomOrderRequest,
} from "../types/custom-order"

const R2 = "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev"

const MODELS = [
  {
    id: "TRUCKER_TELA" as CapModel,
    name: "Trucker",
    tag: "TELA MESH",
    description: "Frente estruturada com painéis em tela nas laterais e traseira",
    image: `${R2}/image1-studio.png`,
    price: 35.9,
    specs: ["5 Painéis", "Tela respirável", "Aba reta"],
  },
  {
    id: "DAD_HAT" as CapModel,
    name: "Dad Hat",
    tag: "LOW PROFILE",
    description: "Perfil baixo, desestruturado e acabamento confortável",
    image: `${R2}/image2-studio.png`,
    price: 35.9,
    specs: ["6 Painéis", "Desestruturado", "Aba curvada"],
  },
  {
    id: "BASEBALL_6_PARTES" as CapModel,
    name: "Americano",
    tag: "ESTRUTURADO",
    description: "Copa alta com 6 gomos, aba pré-curvada clássica",
    image: `${R2}/image3-studio.png`,
    price: 35.9,
    specs: ["6 Gomos", "Copa alta", "Estruturado"],
  },
]

const CAP_LINES: { value: CapLine; label: string; desc: string }[] = [
  { value: "COMERCIAL", label: "Comercial", desc: "Acabamento padrão" },
  { value: "PREMIUM", label: "Premium", desc: "Acabamento superior" },
]

const CAP_MATERIALS: { value: CapMaterial; label: string }[] = [
  { value: "SUPERCAP", label: "Supercap" },
  { value: "CAMURCA", label: "Camurça" },
  { value: "JUNTA", label: "Junta" },
  { value: "BRIM", label: "Brim" },
  { value: "COURO", label: "Couro" },
]

const SWATCH_COLORS = [
  "#000000", "#1a1a1a", "#333333", "#4a4a4a", "#666666",
  "#808080", "#999999", "#b3b3b3", "#cccccc", "#e0e0e0",
  "#f0f0f0", "#ffffff", "#1c1c2e", "#2c3e50", "#0f3460",
  "#1a5276", "#922b21", "#c0392b", "#e74c3c", "#f39c12",
  "#27ae60", "#2ecc71", "#2980b9", "#8e44ad",
]

export function StudioPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const logoEditorRef = useRef<LogoEditorHandle>(null)

  const [step, setStep] = useState(0)
  const [selectedModel, setSelectedModel] = useState<CapModel | null>(null)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)

  const [form, setForm] = useState({
    capLine: "COMERCIAL" as CapLine,
    capMaterial: "SUPERCAP" as CapMaterial,
    strapType: "PLASTICO" as StrapType,
    laserCut: false,
    fullLaserCut: false,
    colorFront: "#FFFFFF",
    colorMesh: "#FFFFFF",
    colorBrim: "#FFFFFF",
    colorBrimLining: "#FFFFFF",
    quantity: 1,
    observations: "",
    logoDetails: [] as LogoDetail[],
  })

  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAdvance = () => {
    if (step === 0 && !selectedModel) return
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/personalize" } })
      return
    }
    if (step === 2 && logoEditorRef.current) {
      const file = logoEditorRef.current.getLogoFile()
      if (file) setLogoFile(file)
      const dataUrl = logoEditorRef.current.getExportDataUrl()
      if (dataUrl) setLogoPreviewUrl(dataUrl)
    }
    setStep((s) => Math.min(4, s + 1))
  }

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  const handleSubmit = async () => {
    if (!isAuthenticated || !user || !selectedModel) return
    setSubmitting(true)
    setError("")

    try {
      const payload: CreateCustomOrderRequest = {
        capLine: form.capLine,
        capModel: selectedModel,
        capMaterial: form.capMaterial,
        laserCut: form.laserCut,
        fullLaserCut: form.fullLaserCut,
        strapType: form.strapType,
        colorFront: form.colorFront,
        colorMesh: form.colorMesh || null,
        colorBrim: form.colorBrim,
        colorBrimLining: form.colorBrimLining || null,
        quantity: form.quantity,
        observations: form.observations || null,
        logoDetails: form.logoDetails,
      }

      const order = await createCustomOrder(user.id, payload)
      if (logoFile) await uploadLogo(order.id, logoFile)
      navigate("/minha-conta?tab=pedidos")
    } catch {
      setError("Erro ao enviar pedido. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const stepTitles = ["Modelo", "Cores", "Logo", "Detalhes", "Resumo"]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        @keyframes studioFadeUp {
          from { opacity: 0; transform: translateY(1.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes studioFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heartPulse {
          0% { transform: scale(1); }
          30% { transform: scale(1.35); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes checkReveal {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .studio-card-reveal {
          opacity: 0;
          animation: studioFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .studio-text-reveal {
          opacity: 0;
          animation: studioFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .studio-step-enter {
          animation: studioFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .studio-heart-pulse {
          animation: heartPulse 0.45s cubic-bezier(0.17, 0.67, 0.35, 1.5);
        }
        .studio-check-badge {
          animation: checkReveal 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .studio-card {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.4s ease;
        }
        .studio-card:hover {
          transform: translateY(-0.75rem);
          box-shadow: 0 2rem 4rem -0.75rem rgba(0, 0, 0, 0.12),
                      0 0.75rem 1.5rem -0.5rem rgba(0, 0, 0, 0.08);
        }
        .studio-card-dimmed {
          opacity: 0.45;
          filter: saturate(0.7);
        }
        .studio-card-dimmed:hover {
          opacity: 0.75;
          filter: saturate(1);
        }
        @keyframes specSlideIn {
          from { opacity: 0; transform: translateY(0.375rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes selectionBarReveal {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .studio-spec-reveal {
          animation: specSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .studio-selection-bar {
          animation: selectionBarReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .studio-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .studio-field-active {
          box-shadow: 0 0.25rem 1.5rem -0.25rem rgba(0, 0, 0, 0.06);
        }
      `}</style>

      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-16 h-[3.5rem] sm:h-[4.25rem] flex items-center">
          <NavLink
            to="/"
            className="text-[0.75rem] sm:text-[0.8125rem] font-jakarta underline underline-offset-4 decoration-gray-400 hover:decoration-black transition-colors"
          >
            voltar
          </NavLink>
          <h1 className="flex-1 text-center font-jakarta font-extrabold text-[1.125rem] sm:text-[1.375rem] tracking-[0.3em] select-none">
            STUDIO
          </h1>
          <div className="w-[3rem] sm:w-[6.5rem]" />
        </div>
      </header>

      {step > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-16 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 overflow-x-auto">
            {stepTitles.map((title, i) => (
              <div key={title} className="flex items-center gap-2 sm:gap-3 shrink-0">
                {i > 0 && (
                  <div className={`w-4 sm:w-6 h-px transition-colors duration-300 ${i <= step ? "bg-black/30" : "bg-gray-200"}`} />
                )}
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`text-[0.625rem] sm:text-[0.6875rem] font-jakarta tracking-[0.08em] uppercase transition-all duration-300 whitespace-nowrap ${i === step
                    ? "text-black font-semibold"
                    : i < step
                      ? "text-gray-500 hover:text-black cursor-pointer"
                      : "text-gray-300 cursor-default"
                    }`}
                >
                  {title}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-10 lg:py-16">

          {step === 0 && (
            <div>
              <div className="mb-8 sm:mb-12 lg:mb-16 flex items-end justify-between">
                <div>
                  <div
                    className={`transition-all duration-700 ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                  >
                    <span className="font-jakarta text-[0.625rem] sm:text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 sm:mb-3 block">
                      Passo 01 — Modelo
                    </span>
                    <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[3rem] font-jakarta font-bold leading-[1.1] tracking-[-0.02em]">
                      Selecione seu<br />modelo
                    </h2>
                  </div>
                  <p
                    className={cardsVisible ? "studio-text-reveal" : "opacity-0"}
                    style={{ animationDelay: "150ms" }}
                  >
                    <span className="font-jakarta text-[0.8125rem] sm:text-[0.875rem] text-gray-400 mt-3 sm:mt-4 block max-w-[22rem] leading-relaxed">
                      Escolha a base perfeita para criar seu boné exclusivo
                    </span>
                  </p>
                </div>
                <div
                  className={`hidden lg:flex items-center gap-2 transition-all duration-700 delay-300 ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                >
                  <span className="font-jakarta text-[0.6875rem] text-gray-400 tracking-wide">
                    {MODELS.length} modelos disponíveis
                  </span>
                  <div className="flex gap-1 ml-2">
                    {MODELS.map((m) => (
                      <div
                        key={m.id}
                        className={`h-[3px] rounded-full transition-all duration-500 ${selectedModel === m.id ? "w-6 bg-black" : "w-3 bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
                {MODELS.map((model, index) => {
                  const isSelected = selectedModel === model.id
                  const hasSelection = selectedModel !== null
                  const isDimmed = hasSelection && !isSelected
                  const isFav = favorites.has(model.id)

                  return (
                    <div
                      key={model.id}
                      className={cardsVisible ? "studio-card-reveal" : "opacity-0"}
                      style={{ animationDelay: `${200 + index * 150}ms` }}
                    >
                      <div
                        className={`studio-card rounded-[1.25rem] ${isDimmed ? "studio-card-dimmed" : ""}`}
                      >
                        <button
                          onClick={() => setSelectedModel(isSelected ? null : model.id)}
                          className={`w-full text-left group rounded-[1.25rem] transition-all duration-500 outline-none relative ${isSelected
                            ? "ring-[2.5px] ring-black ring-offset-3"
                            : "ring-0"
                            }`}
                        >
                          <div className="aspect-[3/4] bg-[#EBEBEB] rounded-[1.25rem] overflow-hidden relative">
                            <img
                              src={model.image}
                              alt={model.name}
                              className="w-full h-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                              draggable={false}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/[0.03] to-transparent pointer-events-none" />

                            <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full font-jakarta text-[0.625rem] font-semibold tracking-[0.12em] uppercase text-gray-700">
                              {model.tag}
                            </span>

                            {isSelected && (
                              <div className="studio-check-badge absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <h3 className="font-jakarta font-bold text-[1.375rem] text-white drop-shadow-md tracking-[-0.01em]">
                                {model.name}
                              </h3>
                              <p className="font-jakarta text-[0.75rem] text-white/75 mt-1 leading-relaxed drop-shadow-sm translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                {model.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="mt-4 px-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className="font-jakarta font-bold text-[0.9375rem]">
                              R$ {model.price.toFixed(2).replace(".", ",")}
                            </p>
                            <span className="font-jakarta text-[0.6875rem] text-gray-300">|</span>
                            <span className="font-jakarta text-[0.6875rem] text-gray-400">un.</span>
                          </div>
                          <button
                            onClick={() => toggleFavorite(model.id)}
                            className={`w-[2.125rem] h-[2.125rem] rounded-full border flex items-center justify-center transition-all duration-300 ${isFav
                              ? "border-black bg-black"
                              : "border-gray-200 bg-transparent hover:border-black"
                              }`}
                          >
                            <svg
                              className={`w-[0.875rem] h-[0.875rem] transition-colors duration-300 ${isFav ? "studio-heart-pulse" : ""}`}
                              fill={isFav ? "white" : "none"}
                              stroke={isFav ? "white" : "currentColor"}
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-[0.25rem] mt-3">
                          {SWATCH_COLORS.map((color) => (
                            <div
                              key={color}
                              className="w-[0.5625rem] h-[0.5625rem] rounded-[2px] transition-transform duration-200 hover:scale-150"
                              style={{
                                backgroundColor: color,
                                boxShadow: color === "#ffffff" || color === "#f0f0f0" ? "inset 0 0 0 0.5px #d1d1d1" : "none",
                              }}
                            />
                          ))}
                        </div>

                        {isSelected && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {model.specs.map((spec, i) => (
                              <span
                                key={spec}
                                className="studio-spec-reveal px-3 py-1 bg-gray-100 rounded-full font-jakarta text-[0.6875rem] text-gray-600"
                                style={{ animationDelay: `${i * 80}ms` }}
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.12em] mb-3">Linha</p>
                  <div className="flex gap-2">
                    {CAP_LINES.map((line) => (
                      <button
                        key={line.value}
                        onClick={() => handleChange("capLine", line.value)}
                        className={`flex-1 flex flex-col px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${form.capLine === line.value ? "border-black bg-black/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <span className={`font-jakarta font-semibold text-[0.8125rem] ${form.capLine === line.value ? "text-black" : "text-gray-700"}`}>{line.label}</span>
                        <span className="font-jakarta text-[0.625rem] text-gray-400 mt-0.5">{line.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.12em] mb-3">Material</p>
                  <div className="flex flex-wrap gap-2">
                    {CAP_MATERIALS.map((mat) => (
                      <button
                        key={mat.value}
                        onClick={() => handleChange("capMaterial", mat.value)}
                        className={`px-4 py-2 rounded-xl border-2 font-jakarta text-[0.75rem] font-medium transition-all duration-200 cursor-pointer ${form.capMaterial === mat.value ? "border-black bg-black text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedModel && (
                <div className="studio-selection-bar mt-8 sm:mt-10 lg:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAFAFA] rounded-2xl px-5 sm:px-7 py-4 sm:py-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-jakarta font-semibold text-[0.8125rem] sm:text-[0.875rem]">
                        {MODELS.find((m) => m.id === selectedModel)?.name}
                      </p>
                      <p className="font-jakarta text-[0.625rem] sm:text-[0.6875rem] text-gray-400">
                        Modelo selecionado — pronto para personalizar
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAdvance}
                    className="group w-full sm:w-auto h-[2.75rem] sm:h-[3rem] px-6 sm:pl-7 sm:pr-6 bg-black text-white rounded-full font-jakarta font-medium text-[0.75rem] sm:text-[0.8125rem] uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[#1a1a1a] active:scale-[0.97] flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>Personalizar</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}

              {!selectedModel && (
                <div className="mt-10 sm:mt-14 lg:mt-16 transition-all duration-500 opacity-40">
                  <button
                    disabled
                    className="w-full sm:w-auto h-[3rem] sm:h-[3.375rem] px-10 sm:pl-14 sm:pr-12 bg-black text-white rounded-full font-jakarta font-medium text-[0.75rem] sm:text-[0.8125rem] uppercase tracking-[0.18em] disabled:cursor-default flex items-center justify-center gap-3"
                  >
                    <span>Avançar</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {(step === 1 || step === 2) && (
            <div className="studio-step-enter">
              <LogoEditor
                ref={logoEditorRef}
                model={selectedModel || "TRUCKER_TELA"}
                colorFront={form.colorFront}
                colorMesh={form.colorMesh}
                colorBrim={form.colorBrim}
                colorBrimLining={form.colorBrimLining}
                showTools={step === 2}
              />
              {step === 1 && (
                <div className="space-y-4 mt-4">
                  <ColorControls
                    colorFront={form.colorFront}
                    colorMesh={form.colorMesh}
                    colorBrim={form.colorBrim}
                    colorBrimLining={form.colorBrimLining}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="studio-step-enter max-w-[40rem] mx-auto">
              <DetailsSelector
                logoDetails={form.logoDetails}
                strapType={form.strapType}
                laserCut={form.laserCut}
                fullLaserCut={form.fullLaserCut}
                quantity={form.quantity}
                observations={form.observations}
                onChange={handleChange}
              />
            </div>
          )}

          {step === 4 && (
            <div className="studio-step-enter max-w-[40rem] mx-auto">
              <OrderSummary
                data={{ ...form, capModel: selectedModel!, capLine: form.capLine } as CreateCustomOrderRequest}
                logoPreviewUrl={logoPreviewUrl}
                submitting={submitting}
                onSubmit={handleSubmit}
              />
            </div>
          )}

          {error && (
            <p className="text-[0.8125rem] font-jakarta text-red-600 mt-6">{error}</p>
          )}

          {step > 0 && step < 4 && (
            <div className={`flex justify-between mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 ${step >= 3 ? "max-w-[40rem] mx-auto" : ""}`}>
              <button
                onClick={handleBack}
                className="group h-[2.75rem] sm:h-[3.375rem] px-5 sm:pl-10 sm:pr-12 rounded-full border border-gray-200 font-jakarta font-medium text-[0.75rem] sm:text-[0.8125rem] uppercase tracking-[0.12em] hover:border-black transition-all duration-300 active:scale-[0.97] flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Voltar</span>
              </button>
              <button
                onClick={handleAdvance}
                className="group h-[2.75rem] sm:h-[3.375rem] px-6 sm:pl-14 sm:pr-12 bg-black text-white rounded-full font-jakarta font-medium text-[0.75rem] sm:text-[0.8125rem] uppercase tracking-[0.18em] hover:bg-[#1a1a1a] transition-all duration-300 active:scale-[0.97] flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <span>Avançar</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
