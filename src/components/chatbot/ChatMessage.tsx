interface ChatMessageProps {
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600 hover:text-blue-800 break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export function ChatMessageBubble({ text, sender, timestamp }: ChatMessageProps) {
  const isBot = sender === "bot"

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          isBot
            ? "bg-gray-100 text-gray-800 rounded-bl-sm"
            : "bg-black text-white rounded-br-sm"
        }`}
      >
        {linkify(text)}
        <div
          className={`text-[10px] mt-1 ${
            isBot ? "text-gray-400" : "text-gray-300"
          }`}
        >
          {timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
