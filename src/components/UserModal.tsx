"use client"

import type React from "react"
import { FaBrush, FaGear } from "react-icons/fa6"
import { MdHelp } from "react-icons/md"
import { FiLogOut } from "react-icons/fi"

interface UserModalProps {
  onClose: () => void
}

export default function UserModal({ onClose }: UserModalProps) {
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
            <button className="modal-option">
              <span className="option-icon">
                <FaBrush size={18} />
              </span>
              <span>Personalización</span>
            </button>
            <button className="modal-option">
              <span className="option-icon">
                <FaGear size={18} />
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

          <div className="modal-divider"></div>

          <div className="modal-footer">
            <span className="footer-name">Sho</span>
            <span className="footer-plan">Gratis</span>
            <button className="footer-button">Mejorar plan</button>
          </div>
        </div>
      </div>
    </>
  )
}
