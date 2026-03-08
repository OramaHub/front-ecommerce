export type CapLine = "COMERCIAL" | "PREMIUM"

export type CapModel =
  | "TRUCKER_TELA"
  | "TRUCKER_TECIDO"
  | "ABA_RETA"
  | "DAD_HAT"
  | "BASEBALL_6_PARTES"
  | "OUTRO"

export type CapMaterial = "SUPERCAP" | "CAMURCA" | "JUNTA" | "BRIM" | "COURO"

export type LogoTechnique =
  | "BORDADO"
  | "SILK"
  | "SUBLIMACAO"
  | "APLIK_LASER"
  | "APLIK_SILK"
  | "APLIK_SUBLIMADO"
  | "GRAVADO_LASER"

export type LogoPosition =
  | "FRENTE"
  | "LATERAL_ESQUERDA"
  | "LATERAL_DIREITA"
  | "TRASEIRA"
  | "FORRO_ABA"

export type StrapType = "PLASTICO" | "PANO"

export type CustomOrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "CANCELLED"

export interface LogoDetail {
  position: LogoPosition
  technique: LogoTechnique
}

export interface CreateCustomOrderRequest {
  capLine: CapLine
  capModel: CapModel
  capMaterial: CapMaterial
  laserCut: boolean
  fullLaserCut: boolean
  strapType: StrapType
  colorFront: string
  colorMesh: string | null
  colorBrim: string
  colorBrimLining: string | null
  quantity: number
  observations: string | null
  logoDetails: LogoDetail[]
}

export interface CustomOrderResponse {
  id: number
  orderNumber: string
  clientId: number
  clientName: string
  capLine: CapLine
  capModel: CapModel
  capMaterial: CapMaterial
  laserCut: boolean
  fullLaserCut: boolean
  strapType: StrapType
  colorFront: string
  colorMesh: string | null
  colorBrim: string
  colorBrimLining: string | null
  quantity: number
  logoUrl: string | null
  previewImageUrl: string | null
  layoutImageUrl: string | null
  observations: string | null
  status: CustomOrderStatus
  createdAt: string
  logoDetails: LogoDetail[]
}
