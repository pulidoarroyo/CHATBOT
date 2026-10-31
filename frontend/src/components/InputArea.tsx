import type React from "react"
import { useRef, useState } from "react"
import { MdSend } from "react-icons/md"
import { MdOutlineAttachFile } from "react-icons/md"
import { uploadFileService } from "../services/uploadfile.service"
import { SessionService } from "../services/session.service"

interface InputAreaProps {
  onSendMessage: (message: string) => void
}

export default function InputArea({ onSendMessage }: InputAreaProps) {
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function clearInputFile(): void {
  // Obtenemos el elemento con el tipado correcto
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;

  if (fileInput) {
    // La forma más efectiva de resetearlo
    fileInput.value = ''; 

  }
}

  const handleSend = () => {
    onSendMessage(input)
    clearInputFile()
    setInput("")
  }
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
   
    if (!file) return;

    const chatId = SessionService.getChatId(); 

    try {
      const response = await uploadFileService(chatId, file);
      console.log(response);

    } catch (error) {
      console.error(error);
    }
  };

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

        <input 
          type="file"
          style={{ display: "none" }}
          id="fileUpload"
          onChange={handleFileUpload}
        />

        <label htmlFor="fileUpload" className="action-btn" title="Adjuntar archivo">
          <MdOutlineAttachFile size={20} />
        </label>

        <div className="input-actions">
          <button className="send-btn" onClick={handleSend} title="Enviar">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}