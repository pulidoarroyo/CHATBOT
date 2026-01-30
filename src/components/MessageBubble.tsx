import ReactMarkdown from "react-markdown"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  type?: "text" | "code"
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  if (message.type === "code") {
    return (
      <div className={`message-wrapper ${isUser ? "user" : "assistant"}`}>
        <div className={`code-block`}>
          <pre>
            <code>{message.content}</code>
          </pre>
        </div>
      </div>
    )
  }

  if (message.type === "text" && message.role === "assistant") {
    return (
      <div className={`message-wrapper assistant`}>
        <div className={`assistant-message`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    )
  }

  return (
    <div className={`message-wrapper ${isUser ? "user" : "assistant"}`}>
      <div className={`message-bubble ${isUser ? "user-message" : "assistant-message"}`}>{message.content}</div>
    </div>
  )
}

