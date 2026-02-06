"use client"

import { useState } from "react"
import { useEffect } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SessionService } from './services/session.service'
import { getChatByUserService } from "./services/getchatuser.service"
import type { GetchatuserParams } from "./api/getchatuser.api"
import type { ChatDTO } from "./api/getchatuser.api";


function Chatbot() {
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [activeChat, setActiveChat] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }




  const handleCargarChats = async () => {
    // contactar ep
        try {
          // extraer id_usuario 
          const paramsGetChatuser: GetchatuserParams = {
            userId: SessionService.getUserId()
          };
          
          const response = await getChatByUserService(paramsGetChatuser); // TRAE ARREGLO CON LOS CHATS
          setChats(response.response.data);
          
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error inesperado:"+err);
          }

        } 
  };

    // 3. useEffect para la carga inicial (o constante)
    useEffect(() => {
      // Verificamos dentro del efecto, no afuera
      if (isAuthenticated) {
        handleCargarChats();
        
        // Si realmente lo quieres "constante" (ej. cada 1 minuto):
        const interval = setInterval(handleCargarChats, 60000);
        return () => clearInterval(interval);
      }
    }, [isAuthenticated]);

    // 4. AHORA SÍ, los retornos condicionales después de los Hooks
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }



  return (
    <div className="app-container">
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onToggleSidebar={() => setSidebarOpen(false)}
          refetchChats={handleCargarChats} 
        />
      )}
      <ChatWindow sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  )
}

export default Chatbot
