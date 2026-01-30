import { useState, type FormEvent } from 'react'; // Necesitamos useState
import { useNavigate, Link } from 'react-router-dom';
import "../App.css";

function ForgotPassword() {
  const navigation = useNavigate();
  
  // 1. Estado para capturar el correo
  const [email, setEmail] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!email) {
      alert("Por favor, ingresa un correo electrónico.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Por favor, ingresa un correo electrónico válido (ejemplo@dominio.com).");
      return;
    }
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log("CÓDIGO GENERADO (Simulación de backend):", generatedCode);

    navigation('/verify-code', { 
      state: { 
        userEmail: email, 
        secretCode: generatedCode 
      } 
    });
  };
    return (
    <div className="BG-loginRegister">
      <div className="LIR-container">
        
       
        <div>
          <svg id="Layer_1" viewBox="0 0 24 24" fill="none" stroke="#3ECD9B" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 style={{ textAlign: 'center', padding: '0 10px' }}>¿Olvidaste tu clave?</h1>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            id="email"
            type="email" 
            placeholder=" " // Espacio para que funcione tu :not(:placeholder-shown)
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" style={{ marginTop: '10%' }}>
            ENVIAR CÓDIGO
          </button>
        </form>

        <span>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg style={{width:'1rem', height:'1rem', margin:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </span>
      </div>
    </div>
  );
}

export default ForgotPassword;