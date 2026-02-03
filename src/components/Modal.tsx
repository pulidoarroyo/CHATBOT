import React, { useEffect } from 'react';
import { IoClose } from "react-icons/io5"; // Usaremos un icono real si tienes react-icons, si no, usa la "X" de texto
import '../App.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  
  // 1. Efecto para cerrar con la tecla ESCAPE
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // 2. El onClick={onClose} aquí asegura que al dar click en lo oscuro se cierre
    <div className="modal-overlay" onClick={onClose}>
      
      {/* stopPropagation evita que el click DENTRO de la caja la cierre */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>{title}</h2>
          
          {/* Botón de cerrar */}
          <button className="modal-close-btn" onClick={onClose}>
            {/* Si no tienes react-icons instalado, cambia <IoClose /> por una "X" simple */}
            ✖ 
          </button>
        </div>

        {children}

      </div>
    </div>
  );
};