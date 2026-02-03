"use client"

import { useState } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import { Modal } from "./components/Modal"          // <--- Importar
import { ConfigForm } from "./components/ConfigForm" // <--- Importar

function App() {
  const [chats, setChats] = useState([{ id: 1, name: "Script Figma Typescript" }])
  const [activeChat, setActiveChat] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // 1. Estado para el Modal Grande de Configuración
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  return (
    <div className="app-container">
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onToggleSidebar={() => setSidebarOpen(false)}
          // 2. Pasamos la función para abrirlo
          onOpenConfig={() => setIsConfigOpen(true)}
        />
      )}
      
      <ChatWindow sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* 3. Renderizamos el Modal Grande aquí */}
      <Modal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        title="Configuración"
      >
        <ConfigForm onClose={() => setIsConfigOpen(false)} />
      </Modal>
    </div>
  )
}

export default App
