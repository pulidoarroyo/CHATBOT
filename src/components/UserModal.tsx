import type React from "react"
import { MdHelp } from "react-icons/md"
import { FiLogOut } from "react-icons/fi"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface UserModalProps {
  onClose: () => void
}

export default function UserModal({ onClose }: UserModalProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                <MdHelp size={18} />
              </span>
              <span>Ayuda</span>
              <span className="option-arrow">›</span>
            </button>
            <button className="modal-option logout">
              <span className="option-icon">
                <FiLogOut size={18} />
              </span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}