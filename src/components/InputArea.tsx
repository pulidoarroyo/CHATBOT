"use client"

import type React from "react"
import { useState } from "react"
import { MdSend } from "react-icons/md"
import { RiVoiceprintFill } from "react-icons/ri"
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="input-area">
      <div className="input-container">
        <input
          type="text"
          placeholder="What would you like to know?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="message-input"
        />
        <div className="input-actions">
          <button className="action-btn" title="Attach file">
            <MdOutlineAttachFile size={20} />
          </button>
          <button className="action-btn" title="Voice">
            <RiVoiceprintFill size={20} />
          </button>
          <button className="send-btn" onClick={handleSend} title="Send">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}