import type { Intent } from "./intents"
import type { ConversationStep } from "./conversation"

export interface ConversationLogEntry {
  correlationId: string
  timestamp: string
  sender: "user" | "bot"
  message: string
  intent: Intent | null
  step: ConversationStep
  error?: string
}

export interface ChatMetrics {
  totalMessages: number
  intentCounts: Record<string, number>
  fallbackCount: number
  escalationCount: number
  resolutionCount: number
  errorCounts: Record<number, number>
  sessionStart: string
}

let correlationId = generateCorrelationId()
let logs: ConversationLogEntry[] = []
let metrics: ChatMetrics = createEmptyMetrics()

function generateCorrelationId(): string {
  return `chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function createEmptyMetrics(): ChatMetrics {
  return {
    totalMessages: 0,
    intentCounts: {},
    fallbackCount: 0,
    escalationCount: 0,
    resolutionCount: 0,
    errorCounts: {},
    sessionStart: new Date().toISOString(),
  }
}

export function getCorrelationId(): string {
  return correlationId
}

export function resetSession(): void {
  correlationId = generateCorrelationId()
  logs = []
  metrics = createEmptyMetrics()
}

export function logMessage(
  sender: "user" | "bot",
  message: string,
  intent: Intent | null,
  step: ConversationStep,
  error?: string
): void {
  const entry: ConversationLogEntry = {
    correlationId,
    timestamp: new Date().toISOString(),
    sender,
    message: message.slice(0, 500),
    intent,
    step,
    error,
  }
  logs.push(entry)

  if (sender === "user") {
    metrics.totalMessages++
  }
}

export function trackIntent(intent: Intent): void {
  metrics.intentCounts[intent] = (metrics.intentCounts[intent] || 0) + 1
  if (intent === "DESCONHECIDO") {
    metrics.fallbackCount++
  }
}

export function trackEscalation(): void {
  metrics.escalationCount++
}

export function trackResolution(): void {
  metrics.resolutionCount++
}

export function trackError(httpStatus: number): void {
  metrics.errorCounts[httpStatus] = (metrics.errorCounts[httpStatus] || 0) + 1
}

export function getMetrics(): ChatMetrics {
  return { ...metrics }
}

export function getLogs(): ConversationLogEntry[] {
  return [...logs]
}

export function getConversationSummary(): string {
  const recentLogs = logs.slice(-10)
  if (recentLogs.length === 0) return "Sem histórico."

  return recentLogs
    .map((l) => `[${l.sender}] ${l.message.slice(0, 80)}`)
    .join(" → ")
}

export function getLastError(): string | undefined {
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].error) return logs[i].error
  }
  return undefined
}
