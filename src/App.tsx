"use client"

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import "./App.css"
import LogIn from './LogIn';
import Register from './Register';
import Chatbot from './Chatbot'; 
import Home from './Home';
import FeedbackViewer from './test';


function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/test" element={<FeedbackViewer />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
