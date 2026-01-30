import { useState,  } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import "../App.css"

function NewPassword() {
  const location = useLocation();
  const navigation = useNavigate();
  
  // Recuperamos el email para saber a quién le estamos cambiando la clave
  const { email } = location.state || { email: "usuario" };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validación de coincidencia
    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden.");
      return;
    }

    // 2. Validación de longitud
    if (password.length < 6) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // 3. Simulación de éxito
    console.log(`Cambiando contraseña para: ${email}`);
    alert("✅ ¡Contraseña actualizada con éxito! Ahora puedes iniciar sesión.");
    
    // Volvemos al login
    navigation('/login');
  };

  return (
    // BG-loginRegister aplica el degradado y centra el contenido
    <div className="BG-loginRegister">
      
      {/* LIR-container es tu caja principal con borde verde y hover effect */}
      <div className="LIR-container">
        
        {/* Tu círculo con degradado para el icono */}
        <div>
          <svg id="Layer_1" viewBox="0 0 24 24" fill="none" stroke="#3ECD9B" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
          </svg>
        </div>

        <h1>Nueva Clave</h1>
        
        <span style={{ marginTop: '2%', marginBottom: '0%' }}>
          Para: <b>{email}</b>
        </span>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <label htmlFor="password">Nueva Contraseña</label>
          <input 
            id="password"
            type="password"
            placeholder=" " 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="password-confirm">Confirmar Contraseña</label>
          <input 
            id="password-confirm"
            type="password"
            placeholder=" " 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">
            ACTUALIZAR
          </button>
        </form>

        <span>
          ¿Recordaste tu clave? <Link to="/login">Inicia Sesión</Link>
        </span>
      </div>
    </div>
  );
}

export default NewPassword;