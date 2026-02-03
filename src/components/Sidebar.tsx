"use client"

import { useState } from "react"
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri"
import UserModal from "./UserModal"

interface Chat {
  id: number
  name: string
}

interface SidebarProps {
  chats: Chat[]
  activeChat: number
  onSelectChat: (id: number) => void
  onToggleSidebar: () => void
  onOpenConfig: () => void // <--- 1. AGREGAMOS ESTA PROP
}

export default function Sidebar({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onToggleSidebar, 
  onOpenConfig // <--- 2. LA RECIBIMOS AQUÍ
}: SidebarProps) {
  const [chatsOpen, setChatsOpen] = useState(true)
  const [userModalOpen, setUserModalOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn">NUEVO CHAT</button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title" onClick={() => setChatsOpen(!chatsOpen)} style={{ cursor: "pointer" }}>
          CHATS
          <span className="dropdown-icon">
            {chatsOpen ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
          </span>
        </div>
        {chatsOpen && (
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <span className="chat-icon">📄</span>
                {chat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile" onClick={() => setUserModalOpen(!userModalOpen)} style={{ cursor: "pointer" }}>
          <div className="avatar">👤</div>
          <span className="username">Name_Usuario</span>
        </div>
      </div>

      {/* 3. PASAMOS LA FUNCIÓN AL MENU PEQUEÑO */}
      {userModalOpen && (
        <UserModal 
          onClose={() => setUserModalOpen(false)} 
          onOpenConfig={() => {
            setUserModalOpen(false); // Cerramos el menú pequeño
            onOpenConfig();          // Abrimos el modal grande
          }}
        />
      )}
    </aside>
  )
}
