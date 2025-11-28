"use client"

import { useState } from "react"
import { VscLayoutSidebarLeft } from "react-icons/vsc"
import MessageBubble from "./MessageBubble"
import InputArea from "./InputArea"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  type?: "text" | "code"
}

interface ChatWindowProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function ChatWindow({ sidebarOpen, onToggleSidebar }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "user",
      content: "Hey Flippy! Write me a script for building an Analog Clock.",
      type: "text",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Sure. Here is a Typescript code block for your Analog Clock project. It is built using React, and uses the local time for London, England as standard. Let me know if you would like to make any refinements to the code.",
      type: "text",
    },
    {
      id: 3,
      role: "assistant",
      content: `import React, { useState, useEffect } from "react";
import { defineProperties } from "figma:react";

export default function AnalogClock({
  updateInterval = 1000,
  secondHandColor = "red",
  minuteHandColor = "black",
  hourHandColor = "black",
}) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateClock = () => {
      const londonTimeString = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour12: false
      });
      const [hoursStr, minutesStr, secondsStr] = londonTimeString.split(':');
      setTime({
        hours: parseInt(hoursStr, 10),
        minutes: parseInt(minutesStr, 10),
        seconds: parseInt(secondsStr, 10)
      });
    };

    updateClock();
    const timerId = setInterval(updateClock, updateInterval);
    return () => clearInterval(timerId);
  }, [updateInterval]);

  return () => <></>;
}`,
      type: "code",
    },
  ])

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: message,
      type: "text",
    }
    setMessages([...messages, newMessage])
  }

  return (
    <main className="chat-window">
      <div className="chat-header">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} title="Toggle sidebar">
          <VscLayoutSidebarLeft size={24} />
        </button>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
    </main>
  )
}
