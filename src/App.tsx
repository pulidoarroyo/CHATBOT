"use client"

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import "./App.css"
import LogIn from './LogIn';
import Register from './Register';
import Chatbot from './Chatbot'; 
import Home from './Home';
import  ForgotPassword from './Olvide Contraseña/forgot-pasword';
import  VerifyCode from './Olvide Contraseña/VerifyCode';
import NewPassword from './Olvide Contraseña/NewPassword';

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
