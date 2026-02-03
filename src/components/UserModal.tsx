import type React from "react"
import { MdHelp } from "react-icons/md"
import { FiLogOut, FiSettings } from "react-icons/fi" // Importamos el icono de engranaje

// Definimos que este componente espera recibir la función de abrir config
interface UserModalProps {
  onClose: () => void
  onOpenConfig: () => void 
}

export default function UserModal({ onClose, onOpenConfig }: UserModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="user-modal">
          <div className="modal-profile-section">
            <div className="modal-avatar">👤</div>
            <span className="modal-username">Name_Usuario</span>
          </div>

          <div className="modal-divider"></div>

          <div className="modal-options">
            {/* 3. Nuevo Botón de Configuración */}
            <button className="modal-option" onClick={onOpenConfig}>
              <span className="option-icon">
                <FiSettings size={18} />
              </span>
              <span>Configuración</span>
            </button>

            <button className="modal-option">
              <span className="option-icon">
                <MdHelp size={18} />
              </span>
              <span>Ayuda</span>
              <span className="option-arrow">›</span>
            </button>
            
            <button className="modal-option logout">
              <span className="option-icon">
                <FiLogOut size={18} />
              </span>
              <span>Cerrar sesión</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
