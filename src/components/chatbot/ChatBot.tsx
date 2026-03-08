import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Minus } from "lucide-react"
import { ChatMessageBubble } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import {
  processMessage,
  createInitialState,
  type ConversationState,
  type ChatMessage,
  type UserContext,
} from "../../services/chatbot/handlers"
import { responses } from "../../services/chatbot/responses"
import { resetSession, getMetrics } from "../../services/chatbot/logger"
import { useAuth } from "../../contexts/AuthContext"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: generateId(),
    text: responses.saudacao(),
    sender: "bot",
    timestamp: new Date(),
  }
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()])
  const [conversationState, setConversationState] = useState<ConversationState>(createInitialState())
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuth()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const userCtx: UserContext = {
    isAuthenticated,
    userId: user?.id ?? null,
    email: user?.email ?? null,
  }

  async function handleSend(text: string) {
    const userMessage: ChatMessage = {
      id: generateId(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    try {
      const { botMessage, newState } = await processMessage(text, conversationState, userCtx)
      setMessages((prev) => [...prev, botMessage])
      setConversationState(newState)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: responses.erroApi(),
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  function handleToggle() {
    if (isOpen) {
      if (import.meta.env.DEV) {
        console.log("[ChatBot Metrics]", getMetrics())
      }
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      resetSession()
      setMessages([createWelcomeMessage()])
      setConversationState(createInitialState())
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Abrir chat"
      >
        <MessageCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl w-[380px]"
      style={{ maxHeight: isMinimized ? "56px" : "calc(100vh - 100px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Assistente da Loja</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label={isMinimized ? "Expandir" : "Minimizar"}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={handleToggle}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Fechar chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: "300px", maxHeight: "450px" }}>
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                text={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))}
            {isProcessing && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isProcessing} />
        </>
      )}
    </div>
  )
}
