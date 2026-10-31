"use client"

import { useState } from "react"
import "./App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { registerService } from "./services/register.service"

import ErrorToast from "./components/ErrorToast";
import { useErrorToast } from "./hooks/useErrorToast";
import "./styles/error-toast.css";
import ValidationError from "./components/validationError";
import './styles/validation-error.css';
import axios from "axios";

import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';


function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [rightPassword, setRightPassword] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { error, showError, clearError } = useErrorToast();
  const [ConfirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { login } = useAuth();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setSuccess(null);

    // Validación básica de contraseñas
    if((password !== confirmPassword)){
      setConfirmPasswordError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await registerService({ 
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
      });

      if (response.message && response.message.toLowerCase().includes("error")) {
        showError(response.message);
      } else {
        //setSuccess("¡Entrando!");
        
        login(response.user);
        setTimeout(() => {
        navigate('/chatbot');
        }, 2000);
      }
    } catch (err: unknown) { 
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message ||
            "Error de conexión con el servidor.";
            showError(message);
        } else {
          // Error inesperado (JS / lógica)
          showError("Ocurrió un error inesperado.");
    }

    }finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (ConfirmPasswordError) {
      if (value === password) {
        setConfirmPasswordError(null); // 
      } else {
        setConfirmPasswordError("Las contraseñas aún no coinciden.");
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/chatbot" replace />;
  }

  return (
     <div className="BG-loginRegister">
    {error && <ErrorToast message={error} onClose={clearError} />} 
    <form className="LIR-container" onSubmit={handleSubmit} >
      <h1>¡Registrate!</h1>
        <label>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" fill="#3ECD9B"/>
        </svg>
       Nombre 
      </label>
       <input type="text" name="nombre" placeholder=" " value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
        <label>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" fill="#3ECD9B"/>
        </svg>
        Apellido
      </label>
       <input type="text" name="apellido" placeholder=" " value={apellido} onChange={(e) => setApellido(e.target.value)} required/>
      <label>
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0V29.6691H40V0H0ZM34.0333 3.29657L20 15.9059L5.96667 3.29657H34.0333ZM3.33333 5.37341L9.88333 11.2578L3.33333 22.0705V5.37341ZM4.61667 26.3726L12.4 13.5324L20 20.3563L27.6 13.5324L35.3833 26.3726H4.61667ZM36.6667 22.0705L30.1167 11.2578L36.6667 5.37341V22.0705Z" fill="#3ECD9B"/>
        </svg>
       Correo Electrónico
      </label>
        <input type="email" name="email" placeholder=" " value={email} onChange={(e) =>  setEmail(e.target.value)} required/>
      <label>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3315 10.1724C7.80821 10.1724 3.33154 14.649 3.33154 20.1724C3.33154 25.6957 7.80821 30.1724 13.3315 30.1724C16.8699 30.1724 20.9465 28.1391 22.7899 23.4924L29.9982 23.5057L31.6649 26.8391H36.6649V16.839L22.7766 16.8224C20.9866 12.3057 16.8699 10.1724 13.3315 10.1724ZM13.3315 18.5057C13.7582 18.5057 14.2032 18.6491 14.5299 18.9741C15.1799 19.6257 15.1799 20.719 14.5299 21.3707C13.8782 22.0207 12.7849 22.0207 12.1332 21.3707C11.4832 20.719 11.4832 19.6257 12.1332 18.9741C12.4599 18.6491 12.9049 18.5057 13.3315 18.5057Z" fill="#3ECD9B"/>
        </svg>
        Contraseña
      </label>
        <input type={showPassword ? "text" : "password"} id="password2" name="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required/>
       <button id="eye-password2" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FontAwesomeIcon icon={faEyeSlash} />:<FontAwesomeIcon icon={faEye} />}</button>
       <label>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3315 10.1724C7.80821 10.1724 3.33154 14.649 3.33154 20.1724C3.33154 25.6957 7.80821 30.1724 13.3315 30.1724C16.8699 30.1724 20.9465 28.1391 22.7899 23.4924L29.9982 23.5057L31.6649 26.8391H36.6649V16.839L22.7766 16.8224C20.9866 12.3057 16.8699 10.1724 13.3315 10.1724ZM13.3315 18.5057C13.7582 18.5057 14.2032 18.6491 14.5299 18.9741C15.1799 19.6257 15.1799 20.719 14.5299 21.3707C13.8782 22.0207 12.7849 22.0207 12.1332 21.3707C11.4832 20.719 11.4832 19.6257 12.1332 18.9741C12.4599 18.6491 12.9049 18.5057 13.3315 18.5057Z" fill="#3ECD9B"/>
        </svg>
       Confirma tu Contraseña
      </label>
       <input type={rightPassword ? "text" : "password"} id="password3" name="password" placeholder=" "value={confirmPassword} onChange={(e) => handleConfirmPasswordChange(e.target.value)} required/>
       <button id="eye-password3" type="button" onClick={() => setRightPassword(!rightPassword)}>{rightPassword ? <FontAwesomeIcon icon={faEyeSlash} />:<FontAwesomeIcon icon={faEye} />}</button>
       {ConfirmPasswordError && (<ValidationError message={ConfirmPasswordError} />)}
       <button type="submit">REGISTRARSE</button>
      <span>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></span>
    </form>
  </div>
  )
}

export default Register
 


