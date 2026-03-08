import type { Intent } from "./intents"

export type ConversationStep =
  | "IDLE"
  | "AGUARDANDO_CEP"
  | "AGUARDANDO_NOME_PRODUTO"
  | "AGUARDANDO_ID_PRODUTO"
  | "AGUARDANDO_EMAIL_SENHA"
  | "AGUARDANDO_ID_PEDIDO_CANCELAR"
  | "AGUARDANDO_CONFIRMACAO"

export interface ConversationState {
  step: ConversationStep
  lastIntent: Intent | null
  failCount: number
  context: Record<string, unknown>
}

export function createInitialState(): ConversationState {
  return {
    step: "IDLE",
    lastIntent: null,
    failCount: 0,
    context: {},
  }
}

export function shouldEscalate(state: ConversationState): boolean {
  return state.failCount >= 2
}

export function incrementFail(state: ConversationState): ConversationState {
  return { ...state, failCount: state.failCount + 1 }
}

export function resetFail(state: ConversationState): ConversationState {
  return { ...state, failCount: 0 }
}

export function setStep(state: ConversationState, step: ConversationStep, intent?: Intent): ConversationState {
  return {
    ...state,
    step,
    lastIntent: intent ?? state.lastIntent,
    failCount: 0,
  }
}

export function setContext(state: ConversationState, key: string, value: unknown): ConversationState {
  return {
    ...state,
    context: { ...state.context, [key]: value },
  }
}
