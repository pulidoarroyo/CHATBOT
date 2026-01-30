import type React from "react"
import { useState } from "react"
import { MdSend } from "react-icons/md"
import { MdOutlineAttachFile } from "react-icons/md"

interface InputAreaProps {
  onSendMessage: (message: string) => void
}

export default function InputArea({ onSendMessage }: InputAreaProps) {
  const [input, setInput] = useState("")

  const handleSend = () => {
    onSendMessage(input)
    setInput("")
  }

  return (
    <div className="input-area">
      <div className="input-container">
        <input
          type="text"
          placeholder="Consulta tus dudas aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <div className="input-actions">
          <button className="action-btn" title="Attach file">
            <MdOutlineAttachFile size={20} />
          </button>
          <button className="send-btn" onClick={handleSend} title="Send">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}