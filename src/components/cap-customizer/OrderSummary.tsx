import type { CreateCustomOrderRequest, LogoDetail } from "../../types/custom-order"

const LABELS: Record<string, Record<string, string>> = {
  capLine: { COMERCIAL: "Comercial", PREMIUM: "Premium" },
  capModel: {
    TRUCKER_TELA: "Trucker Tela",
    TRUCKER_TECIDO: "Trucker Tecido",
    ABA_RETA: "Aba Reta",
    DAD_HAT: "Dad Hat",
    BASEBALL_6_PARTES: "Baseball 6 Partes",
    OUTRO: "Outro",
  },
  capMaterial: { SUPERCAP: "Supercap", CAMURCA: "Camurça", JUNTA: "Junta", BRIM: "Brim", COURO: "Couro" },
  strapType: { PLASTICO: "Plástico", PANO: "Pano" },
  position: { FRENTE: "Frente", LATERAL_ESQUERDA: "Lat. Esquerda", LATERAL_DIREITA: "Lat. Direita", TRASEIRA: "Traseira", FORRO_ABA: "Forro da Aba" },
  technique: { BORDADO: "Bordado", SILK: "Silk", SUBLIMACAO: "Sublimação", APLIK_LASER: "Aplik Laser", APLIK_SILK: "Aplik Silk", APLIK_SUBLIMADO: "Aplik Sublimado", GRAVADO_LASER: "Gravado a Laser" },
}

function SummarySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-jakarta text-[0.625rem] text-gray-400 uppercase tracking-[0.15em] mb-3">{label}</p>
      {children}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-jakarta text-[0.8125rem] text-gray-500">{label}</span>
      <span className="font-jakarta text-[0.8125rem] font-medium">{value}</span>
    </div>
  )
}

function ColorRow({ color, label }: { color: string; label: string }) {
  const isWhite = color.toUpperCase() === "#FFFFFF"
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-jakarta text-[0.8125rem] text-gray-500">{label}</span>
      <div className="flex items-center gap-2.5">
        <span className="font-jakarta text-[0.6875rem] font-mono text-gray-400">{color}</span>
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: isWhite ? "inset 0 0 0 1px #d1d5db" : "none",
          }}
        />
      </div>
    </div>
  )
}

function LogoDetailRow({ detail, index }: { detail: LogoDetail; index: number }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-6 h-6 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
        <span className="font-jakarta font-bold text-[0.625rem] text-gray-500">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-jakarta text-[0.8125rem] font-medium">{LABELS.position[detail.position]}</span>
      </div>
      <span className="font-jakarta text-[0.75rem] text-gray-400 shrink-0">{LABELS.technique[detail.technique]}</span>
    </div>
  )
}

interface OrderSummaryProps {
  data: CreateCustomOrderRequest
  logoPreviewUrl: string | null
  submitting: boolean
  onSubmit: () => void
}

export function OrderSummary({ data, logoPreviewUrl, submitting, onSubmit }: OrderSummaryProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <span className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.15em] mb-2 block">
          Passo final
        </span>
        <h3 className="font-jakarta font-bold text-[1.25rem] md:text-[1.5rem] tracking-[-0.02em]">
          Resumo do Pedido
        </h3>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 md:p-6 space-y-6">
          <SummarySection label="Modelo">
            <div className="divide-y divide-gray-100">
              <SummaryRow label="Linha" value={LABELS.capLine[data.capLine]} />
              <SummaryRow label="Modelo" value={LABELS.capModel[data.capModel]} />
              <SummaryRow label="Material" value={LABELS.capMaterial[data.capMaterial]} />
            </div>
          </SummarySection>

          <div className="h-px bg-gray-100" />

          <SummarySection label="Cores">
            <div className="divide-y divide-gray-100">
              <ColorRow color={data.colorFront} label="Frente" />
              {data.colorMesh && <ColorRow color={data.colorMesh} label="Tela / Lateral" />}
              <ColorRow color={data.colorBrim} label="Aba" />
              {data.colorBrimLining && <ColorRow color={data.colorBrimLining} label="Forro da Aba" />}
            </div>
          </SummarySection>

          {logoPreviewUrl && (
            <>
              <div className="h-px bg-gray-100" />
              <SummarySection label="Logo">
                <div className="w-16 h-16 rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center">
                  <img src={logoPreviewUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              </SummarySection>
            </>
          )}

          {data.logoDetails.length > 0 && (
            <>
              <div className="h-px bg-gray-100" />
              <SummarySection label="Aplicações">
                <div className="divide-y divide-gray-100">
                  {data.logoDetails.map((d, i) => <LogoDetailRow key={i} detail={d} index={i} />)}
                </div>
              </SummarySection>
            </>
          )}

          <div className="h-px bg-gray-100" />

          <SummarySection label="Detalhes">
            <div className="divide-y divide-gray-100">
              <SummaryRow label="Ataca" value={LABELS.strapType[data.strapType]} />
              {data.laserCut && <SummaryRow label="Furado a laser" value="Sim" />}
              {data.fullLaserCut && <SummaryRow label="Laser completo" value="Sim" />}
              <SummaryRow label="Quantidade" value={`${data.quantity} ${data.quantity === 1 ? "un." : "un."}`} />
            </div>
          </SummarySection>

          {data.observations && (
            <>
              <div className="h-px bg-gray-100" />
              <SummarySection label="Observações">
                <p className="font-jakarta text-[0.8125rem] text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {data.observations}
                </p>
              </SummarySection>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 bg-[#FAFAFA] px-5 md:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-jakarta text-[0.6875rem] text-gray-400 uppercase tracking-[0.1em]">Total estimado</p>
            <p className="font-jakarta font-bold text-[1.125rem] tracking-[-0.01em] mt-0.5">Sob consulta</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="group w-full h-[3.5rem] bg-black text-white rounded-2xl font-jakarta font-semibold text-[0.875rem] tracking-[0.06em] hover:bg-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-default cursor-pointer active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Enviando pedido...</span>
          </>
        ) : (
          <>
            <span>Confirmar Pedido</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}
