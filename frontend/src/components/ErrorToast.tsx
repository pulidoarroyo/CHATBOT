import React, { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose, duration = 5000 }) => {
  
  useEffect(() => {

    // 1. Configuramos el temporizador para cerrar automáticamente el toast
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // 2. Función de limpieza (Cleanup)
    // Se ejecuta si el componente se desmonta antes de que acabe el tiempo
    return () => clearTimeout(timer);
  }, [onClose, duration]); // Dependencias: se reinicia si cambian estas variables

  return (
    <div className="error-toast">
      <span>{message}</span>
    </div>
  );
};

export default ErrorToast;