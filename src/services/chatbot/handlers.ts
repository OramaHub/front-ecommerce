import { recognizeIntent, extractCep, extractProductName, extractNumber, type Intent } from "./intents"
import {
  type ConversationState,
  createInitialState,
  setStep,
  incrementFail,
  shouldEscalate,
} from "./conversation"
import { responses } from "./responses"
import {
  logMessage,
  trackIntent,
  trackEscalation,
  trackResolution,
  trackError,
  getCorrelationId,
  getConversationSummary,
  getLastError,
} from "./logger"
import { getProducts, searchProducts, getProductById } from "../product-service"
import { calculateShipping } from "../shipping-service"
import { authService } from "../auth-service"
import { getClientOrders, cancelOrder } from "../order-service"
import { getAddresses, getDefaultAddress } from "../address-service"

export interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface HandlerResult {
  reply: string
  newState: ConversationState
}

export interface UserContext {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
}

interface ApiError {
  response?: {
    status?: number
    data?: { message?: string; error?: string }
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function handleApiError(error: unknown): string {
  const apiErr = error as ApiError
  const status = apiErr?.response?.status
  const detail = apiErr?.response?.data?.message || apiErr?.response?.data?.error

  if (status) trackError(status)

  switch (status) {
    case 400:
      return responses.erroValidacao(detail)
    case 401:
    case 403:
      return responses.necessitaLogin()
    case 404:
      return responses.erroNaoEncontrado()
    case 422:
      return responses.erroValidacao(detail)
    case 429:
      return responses.erroRateLimit()
    default:
      if (status && status >= 500) return responses.erroServidor()
      return responses.erroApi()
  }
}

async function handleIntent(
  intent: Intent,
  message: string,
  state: ConversationState,
  userCtx: UserContext
): Promise<HandlerResult> {
  trackIntent(intent)

  try {
    switch (intent) {
      case "SAUDACAO":
        return { reply: responses.saudacao(), newState: setStep(state, "IDLE", intent) }

      case "MENU":
        return { reply: responses.menu(), newState: setStep(state, "IDLE", intent) }

      case "LISTAR_PRODUTOS": {
        const result = await getProducts(0, 5)
        return {
          reply: responses.listarProdutos(result.content, result.totalElements),
          newState: setStep(state, "IDLE", intent),
        }
      }

      case "BUSCAR_PRODUTO_NOME": {
        const name = extractProductName(message)
        if (!name || name.length < 2) {
          return { reply: responses.buscarProdutoPedir(), newState: setStep(state, "AGUARDANDO_NOME_PRODUTO", intent) }
        }
        const result = await searchProducts(name, 0, 5)
        return {
          reply: responses.buscarProdutoResultado(result.content, name),
          newState: setStep(state, "AGUARDANDO_ID_PRODUTO", intent),
        }
      }

      case "DETALHE_PRODUTO": {
        const id = extractNumber(message)
        if (!id) {
          return { reply: responses.detalheProdutoPedirId(), newState: setStep(state, "AGUARDANDO_ID_PRODUTO", intent) }
        }
        const product = await getProductById(id)
        return {
          reply: responses.detalheProduto(product),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", intent),
        }
      }

      case "CALCULAR_FRETE": {
        const cep = extractCep(message)
        if (!cep) {
          return { reply: responses.fretePedirCep(), newState: setStep(state, "AGUARDANDO_CEP", intent) }
        }
        if (cep.length !== 8) {
          return { reply: responses.freteCepInvalido(), newState: setStep(state, "AGUARDANDO_CEP", intent) }
        }
        const shipping = await calculateShipping(cep)
        return {
          reply: responses.freteResultado(shipping),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", intent),
        }
      }

      case "LOGIN":
        return { reply: responses.loginRedirecionar(), newState: setStep(state, "IDLE", intent) }

      case "CADASTRO":
        return { reply: responses.cadastroRedirecionar(), newState: setStep(state, "IDLE", intent) }

      case "RECUPERAR_SENHA":
        return { reply: responses.recuperarSenhaPedirEmail(), newState: setStep(state, "AGUARDANDO_EMAIL_SENHA", intent) }

      case "PEDIDO_LISTAR": {
        if (!userCtx.isAuthenticated || !userCtx.userId) {
          return { reply: responses.necessitaLogin(), newState: setStep(state, "IDLE", intent) }
        }
        const orders = await getClientOrders(userCtx.userId)
        return {
          reply: responses.pedidoListar(orders),
          newState: setStep(state, "IDLE", intent),
        }
      }

      case "PEDIDO_CANCELAR": {
        if (!userCtx.isAuthenticated) {
          return { reply: responses.necessitaLogin(), newState: setStep(state, "IDLE", intent) }
        }
        const orderId = extractNumber(message)
        if (!orderId) {
          return { reply: responses.pedidoCancelarPedirId(), newState: setStep(state, "AGUARDANDO_ID_PEDIDO_CANCELAR", intent) }
        }
        const cancelled = await cancelOrder(orderId)
        return {
          reply: responses.pedidoCancelado(cancelled.orderNumber),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", intent),
        }
      }

      case "ENDERECO_LISTAR": {
        if (!userCtx.isAuthenticated) {
          return { reply: responses.necessitaLogin(), newState: setStep(state, "IDLE", intent) }
        }
        const addresses = await getAddresses()
        return {
          reply: responses.enderecoListar(addresses),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", intent),
        }
      }

      case "ENDERECO_DEFAULT": {
        if (!userCtx.isAuthenticated) {
          return { reply: responses.necessitaLogin(), newState: setStep(state, "IDLE", intent) }
        }
        const addr = await getDefaultAddress()
        return {
          reply: responses.enderecoDefault(addr),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", intent),
        }
      }

      case "FALAR_ATENDENTE":
        return {
          reply: responses.whatsappLink(
            state.lastIntent ?? "geral",
            userCtx.email ?? "não identificado",
            getCorrelationId(),
            getLastError(),
            getConversationSummary()
          ),
          newState: setStep(state, "IDLE", intent),
        }

      case "SIM":
        trackResolution()
        return { reply: responses.resolucaoSim(), newState: setStep(state, "IDLE", intent) }

      case "NAO":
        return { reply: responses.resolucaoNao(), newState: setStep(state, "IDLE", intent) }

      default:
        return { reply: responses.desconhecido(), newState: incrementFail(state) }
    }
  } catch (error: unknown) {
    const apiErr = error as ApiError
    const status = apiErr?.response?.status
    const errorMsg = handleApiError(error)
    logMessage("bot", errorMsg, intent, state.step, `HTTP ${status || "unknown"}`)

    if (status === 401 || status === 403) {
      return { reply: errorMsg, newState: setStep(state, "IDLE") }
    }
    return { reply: errorMsg, newState: incrementFail(state) }
  }
}

async function handlePendingStep(
  message: string,
  state: ConversationState,
  _userCtx: UserContext
): Promise<HandlerResult | null> {
  try {
    switch (state.step) {
      case "AGUARDANDO_CEP": {
        const cep = extractCep(message)
        if (!cep || cep.length !== 8) {
          return { reply: responses.freteCepInvalido(), newState: state }
        }
        const shipping = await calculateShipping(cep)
        return {
          reply: responses.freteResultado(shipping),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", "CALCULAR_FRETE"),
        }
      }

      case "AGUARDANDO_NOME_PRODUTO": {
        const name = message.trim()
        if (name.length < 2) {
          return { reply: "Por favor, digite ao menos 2 caracteres para buscar.", newState: state }
        }
        const result = await searchProducts(name, 0, 5)
        return {
          reply: responses.buscarProdutoResultado(result.content, name),
          newState: setStep(state, "AGUARDANDO_ID_PRODUTO", "BUSCAR_PRODUTO_NOME"),
        }
      }

      case "AGUARDANDO_ID_PRODUTO": {
        const id = extractNumber(message)
        if (!id) {
          return { reply: responses.detalheProdutoPedirId(), newState: state }
        }
        const product = await getProductById(id)
        return {
          reply: responses.detalheProduto(product),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", "DETALHE_PRODUTO"),
        }
      }

      case "AGUARDANDO_EMAIL_SENHA": {
        const emailMatch = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)
        if (!emailMatch) {
          return { reply: "Por favor, informe um e-mail válido.", newState: state }
        }
        try {
          await authService.forgotPassword(emailMatch[0])
        } catch {
          // Não revelamos se o email existe ou não
        }
        return {
          reply: responses.recuperarSenhaEnviado(),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", "RECUPERAR_SENHA"),
        }
      }

      case "AGUARDANDO_ID_PEDIDO_CANCELAR": {
        const orderId = extractNumber(message)
        if (!orderId) {
          return { reply: responses.pedidoCancelarPedirId(), newState: state }
        }
        const cancelled = await cancelOrder(orderId)
        return {
          reply: responses.pedidoCancelado(cancelled.orderNumber),
          newState: setStep(state, "AGUARDANDO_CONFIRMACAO", "PEDIDO_CANCELAR"),
        }
      }

      case "AGUARDANDO_CONFIRMACAO":
        return null

      default:
        return null
    }
  } catch (error: unknown) {
    const errorMsg = handleApiError(error)
    logMessage("bot", errorMsg, state.lastIntent, state.step, `pending-step-error`)
    return { reply: errorMsg, newState: incrementFail(state) }
  }
}

export async function processMessage(
  message: string,
  state: ConversationState,
  userCtx: UserContext
): Promise<{ botMessage: ChatMessage; newState: ConversationState }> {
  // Log mensagem do usuário
  const intent = recognizeIntent(message)
  logMessage("user", message, intent, state.step)

  let result: HandlerResult

  // Se tem um passo pendente, tentar resolver primeiro
  if (state.step !== "IDLE") {
    if (intent === "MENU" || intent === "FALAR_ATENDENTE") {
      result = await handleIntent(intent, message, state, userCtx)
    } else {
      const pendingResult = await handlePendingStep(message, state, userCtx)
      if (pendingResult) {
        result = pendingResult
      } else {
        result = await handleIntent(intent, message, state, userCtx)
      }
    }
  } else {
    result = await handleIntent(intent, message, state, userCtx)
  }

  // Verificar se deve escalar para WhatsApp
  if (shouldEscalate(result.newState)) {
    trackEscalation()
    result = {
      reply: responses.whatsappLink(
        state.lastIntent ?? "geral",
        userCtx.email ?? "não identificado",
        getCorrelationId(),
        getLastError(),
        getConversationSummary()
      ),
      newState: setStep(createInitialState(), "IDLE"),
    }
  }

  // Adicionar pergunta de confirmação quando aplicável
  if (result.newState.step === "AGUARDANDO_CONFIRMACAO") {
    result.reply += "\n\n" + responses.confirmacaoResolucao()
    result.newState = { ...result.newState, step: "IDLE" }
  }

  // Log resposta do bot
  logMessage("bot", result.reply, result.newState.lastIntent, result.newState.step)

  const botMessage: ChatMessage = {
    id: generateId(),
    text: result.reply,
    sender: "bot",
    timestamp: new Date(),
  }

  return { botMessage, newState: result.newState }
}

export { createInitialState, type ConversationState }
