"use client"

import { useState } from "react"
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri"
import UserModal from "./UserModal"
import { useAuth } from '../hooks/useAuth';
import { ChatbotService } from "../services/postchat.service";
import { SessionService } from "../services/session.service";
import type { PostchatParams } from "../api/postchat.api";
import type { getChatByIdService } from "../services/postchat.service";
import type { GetChatIdParams } from "../services/postchat.service";
import type { getChatByUserService } from "../api/getchatuser.api";
import type { ChatDTO } from "./api/getchatuser.api";

/*interface Chat {
  id: number
  name: string
}*/

interface SidebarProps {
  chats: ChatDTO[]
  activeChat: number
  onSelectChat: (id: number) => void
  onToggleSidebar: () => void
  refetchChats: () => Promise<void>;
}

export default function Sidebar({ chats, activeChat, onSelectChat, onToggleSidebar, refetchChats }: SidebarProps) {
  const [chatsOpen, setChatsOpen] = useState(true)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const { user, logout } = useAuth();
  const [chatNombre, setChatNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Definir nombre a chat

    const params: PostchatParams = {
      userId: SessionService.getUserId(),
      chatNombre,
    };

    try {
      const response = await ChatbotService.createChat(params);

      console.log("Chat creado:", response);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleActiveChat = async () => {




    
  }


  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button onClick={handleSubmit} className="new-chat-btn" >NUEVO CHAT</button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title" onClick={() => setChatsOpen(!chatsOpen)} style={{ cursor: "pointer" }}>
          CHATS
          <span className="dropdown-icon">
            {chatsOpen ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
          </span>
        </div>
        <button onClick={refetchChats}>Actualizar Chats</button>
        {chatsOpen && (
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id_chat}
                className={`chat-item ${activeChat === chat.id_chat ? "active" : ""}`}
                onClick={() => onSelectChat(chat.id_chat)}
              >
                <span className="chat-icon">📄</span>
                {chat.nombre}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile" onClick={() => setUserModalOpen(!userModalOpen)} style={{ cursor: "pointer" }}>
          <div className="avatar">👤</div>
          <span className="username">{user.nombre}</span>
        </div>
      </div>

      {userModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
    </aside>
  )
}
