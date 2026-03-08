import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 p-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Processando..." : "Digite sua mensagem..."}
        className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        <Send size={16} />
      </button>
    </form>
  )
}
