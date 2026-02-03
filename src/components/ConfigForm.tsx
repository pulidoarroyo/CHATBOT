import { useState } from 'react';
import { FiEdit2 } from "react-icons/fi";
import '../App.css';

// Ya no necesitamos props aquí porque el cierre lo maneja el Modal padre
export const ConfigForm = () => {
  const [name] = useState(''); 
  const [email] = useState('');
  
  const [darkMode, setDarkMode] = useState(true);
  const [changeModel, setChangeModel] = useState(false);

  return (
    <div className="config-container">
      
      {/* Sección Nombre */}
      <div className="config-item">
        <label className="config-label">Nombre</label>
        <div className="config-value-row">
          <span className="config-value">{name}</span>
          <button className="edit-btn">
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Sección Correo */}
      <div className="config-item">
        <label className="config-label">Correo</label>
        <div className="config-value-row">
          <span className="config-value">{email}</span>
          <button className="edit-btn">
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Toggle Modo Oscuro */}
      <div className="config-item row-between">
        <span className="config-label-lg">Modo oscuro</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={darkMode} 
            onChange={(e) => setDarkMode(e.target.checked)} 
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Toggle Cambiar Modelo */}
      <div className="config-item row-between">
        <span className="config-label-lg">Cambiar modelo</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={changeModel} 
            onChange={(e) => setChangeModel(e.target.checked)} 
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};