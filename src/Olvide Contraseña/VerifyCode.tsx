import { useState, useRef, useEffect} from 'react';
import { type KeyboardEvent, type FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import "../App.css";

function VerifyCode() {
  const location = useLocation();
  const navigation = useNavigate();
  
  const { userEmail, secretCode } = location.state || { userEmail: "tu correo", secretCode: "" };
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!secretCode) {
      navigation('/forgot-password');
      return;
    }
  }, [secretCode, navigation]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Esto previene la recarga pero permite que salte el "Rellene este campo"
    
    const finalCode = otp.join("");
    if (finalCode === secretCode) {
      navigation('/new-password', { state: { email: userEmail } });
    } else {
      alert("El código no coincide. Intenta de nuevo.");
    }
  };


return (
    <div className="BG-loginRegister">
      <div className="LIR-container2" style={{ height: 'auto', minHeight: '600px', padding: '2rem 0' }}>
        
        <div>
          <svg id="Layer_1" viewBox="0 0 24 24" fill="none" stroke="#3ECD9B" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1>Verificación</h1>
        
        <span style={{ textAlign: 'center', padding: '0 2rem', marginTop: '2%' }}>
          Ingresa el código enviado a: <br/>
          <b style={{ color: '#3ECD9B' }}>{userEmail}</b>
        </span>

        <form onSubmit={handleVerify} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center', 
            marginTop: '5%', 
            width: '100%',
            padding: '0 20px', 
            backgroundColor:'rgba(0,0,0,0)'
        }}>
        {otp.map((data, index) => (
            <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => { inputRefs.current[index] = el; }}
            value={data}
            onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
                width: '45px',
                height: '55px',
                textAlign: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#3ECD9B',
                backgroundColor: 'rgba(62, 205, 155, 0.05)', // Un fondo muy sutil
                border: '2px solid #3ECD9B',
                borderRadius: '12px',
                margin: '0',
                outline: 'none',
                transition: 'all 0.3s ease'
            }}
      // Efecto de brillo al hacer focus
            onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 15px #3ECD9B'}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            />
        ))}
        </div>

        <button type="submit" style={{ marginTop: '10%' }}>
          VERIFICAR
        </button>
        </form>
        
        <p style={{ color: '#3ECD9B', fontSize: '0.7rem', fontFamily: 'monospace', marginTop: '1rem' }} className="animate-pulse">
          SYS_AUTH_CODE: <b>{secretCode}</b>
        </p>

        <span>
          ¿No llegó? <Link to="/forgot-password">Reenviar</Link>
        </span>
      </div>
    </div>
  );
}

export default VerifyCode;