import { useState, useEffect } from "react"
import { VscLayoutSidebarLeft } from "react-icons/vsc"
import { MdDarkMode } from "react-icons/md"
import { BsSunFill } from "react-icons/bs"
import MessageBubble from "./MessageBubble"
import InputArea from "./InputArea"
import { promptService } from "../services/prompt.service"
import { useErrorToast } from "../hooks/useErrorToast";
import axios from "axios"
import ReactMarkdown from 'react-markdown'
import { ChatbotService } from "../services/postchat.service";
import { SessionService } from "../services/session.service";
import type {  PostchatParams } from "../api/postchat.api";


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
  const { error, showError, clearError } = useErrorToast();
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize with false (dark mode is default), true means light mode is active
  const [isLightMode, setIsLightMode] = useState(false)

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    const isLight = savedTheme === 'light'
    setIsLightMode(isLight)
    
    if (isLight) {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [])

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: question,
      type: "text",
    }
    setMessages([...messages, newMessage]);

    handleResponseMessage(question);
   
  }
    const handleResponseMessage = async (question: string) => {
      try {
      const response = await promptService({
        message: question,
      });

      
      if (response.response && response.response.toLowerCase().includes("error")) {
        showError(response.response);
      } else {
        const newMessage: Message = {
          id: messages.length + 1,
          role: "assistant",
          content: response.response,
          type: "text",
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } catch (err: unknown) { 
        if (axios.isAxiosError(err)) {
        // Error proveniente de Axios
        const message =
          err.response?.data?.message ||
          "Error de conexión con el servidor.";
          showError(message.charAt(0).toUpperCase() + message.slice(1).toLowerCase());

        } else {
          // Error inesperado (JS / lógica)
          showError("Ocurrió un error inesperado.");
        }
        }finally {
          clearError();
        }
  }


  // Toggle between dark and light modes - adds/removes 'light' class
  const toggleTheme = () => {
    const newIsLight = !isLightMode
    setIsLightMode(newIsLight)
    
    if (newIsLight) {
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <main className="chat-window">
      <div className="chat-header">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} title="Toggle sidebar">
          <VscLayoutSidebarLeft size={24} />
        </button>
        {/* Theme toggle button with corrected icon logic */}
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
          {isLightMode ? <MdDarkMode size={24} /> : <BsSunFill size={24} />}
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