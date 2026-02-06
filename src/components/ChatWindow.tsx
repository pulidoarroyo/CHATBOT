import { useState, useEffect, useRef } from "react"
import { VscLayoutSidebarLeft } from "react-icons/vsc"
import { MdDarkMode, MdOutlineAttachFile, MdSend } from "react-icons/md"
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
import type {  promptParams } from "../api/prompt.api";
import { truncate } from "../utils/string.utils"
import { useAuth } from "../hooks/useAuth"

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
  const { firstMessageSent} = useAuth();
  const { FFirstMessageSent} = useAuth();
  const { updateChatId } = useAuth();
  const { chatId } = useAuth();
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  //const [ chat, setChat] = useState<number>(0);
  const chat= useRef<number | null>(null);

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
    
    if(!firstMessageSent){
      handleResponseMessage(question); 
    }
    
    handleResponseMessage(question);
    
  }

  const handleResponseMessage = async (question: string) => {
      // 1. CREA CHAT SI Y SOLO SI ES LA 1ERA VEZ
      if( !firstMessageSent ) {

        const paramsPostChat: PostchatParams = {
          userId: SessionService.getUserId(),
          chatNombre: truncate(question, 20), // Definir nombre a chat
        };

        try {
          const response = await ChatbotService.createChat(paramsPostChat);

          // 2. SETEA EL CHAT ID 
          // HAY QUE OBTENER EL CHAT ID Y EJECUTAR EL UPDATECHATID CON LO OBTENIDO
          updateChatId(response.id_chat);
          chat.current = response.id_chat;
          console.log(chat.current);
          await sleep(2000);
          
          const paramsPrompt: promptParams = {
              chatId: chat.current // Use the ref value here!
          };

          //
          //setChat(response.id_chat);
          await sleep(2000);

        // 3. CONTACTAR A EP FEEDBACK PROMPT SERVICE
                  
        //const id_chat = getChatId(); CULPABLE
        //const id_chat = Number(getChatId());
        //const id_chat = chatId;
       
        //const id_chat = chat;
        console.log("antes:"+chat.current);
        await sleep(2000);
        console.log("despues:"+chat.current);
          
        /*const paramsPrompt: promptParams = {
          chatId: id_chat
        };*/

        const response2 = await promptService(paramsPrompt, {
          message: question
        });

        if (response2.response && response2.response.toLowerCase().includes("error")) {
          showError(response2.response);
        } else {
          const newMessage: Message = {
            id: messages.length + 1,
            role: "assistant",
            content: response2.response,
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
        }
        
        FFirstMessageSent(true);

      }else{
        
        const id_chat = SessionService.getChatId(); //CULPABLE
        //const id_chat = Number(getChatId());
        //const id_chat = chat;
        console.log("antes:"+id_chat);
        await sleep(2000);
        console.log("despues:"+id_chat);
        
        // 3. CONTACTAR A EP FEEDBACK PROMPT SERVICE 
        const paramsPrompt: promptParams = {
          chatId: id_chat
        };
        try{
          const response2 = await promptService(paramsPrompt, {
            message: question
          });

          if (response2.response && response2.response.toLowerCase().includes("error")) {
            showError(response2.response);
          } else {
            const newMessage: Message = {
              id: messages.length + 1,
              role: "assistant",
              content: response2.response,
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
        }

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