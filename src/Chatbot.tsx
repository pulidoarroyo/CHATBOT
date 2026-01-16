"use client"

import { useState } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"

function Chatbot() {
  const [chats, setChats] = useState([{ id: 1, name: "Script Figma Typescript" }])
  const [activeChat, setActiveChat] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onToggleSidebar={() => setSidebarOpen(false)}
        />
      )}
      <ChatWindow sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  )
}

export default Chatbot
