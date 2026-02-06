import { createContext, useState} from 'react';
import type { ReactNode } from 'react';

import { type User } from "../services/login.service";

interface AuthContextType {
  user: User | null;
  firstMessageSent: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  FFirstMessageSent: (sent: boolean) => void;
  chatId: number;
  updateChatId : (id: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicialización síncrona para evitar parpadeos de UI
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [firstMessageSent, setFirstMessageSent] = useState<boolean>(() => {
    const savedStatus = localStorage.getItem('first_message_sent');
    return savedStatus ? JSON.parse(savedStatus) : false;
  }); 

  const [chatId, setChatId] = useState<number>(() => {
    const savedChatId = localStorage.getItem('chat_id');
    return savedChatId ? parseInt(savedChatId, 10) : 0;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setFirstMessageSent(false);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('first_message_sent');
    localStorage.removeItem('chat_id');
  };

  const FFirstMessageSent = (sent: boolean) => {
    setFirstMessageSent(sent);
    localStorage.setItem('first_message_sent', JSON.stringify(sent));
  }

  const updateChatId = (id: number) => {
    setChatId(id);
    localStorage.setItem('chat_id', id.toString());
  };


  return (
    <AuthContext.Provider value={{ user, firstMessageSent, login, logout, isAuthenticated: !!user, FFirstMessageSent, chatId, updateChatId}}>
      {children}
    </AuthContext.Provider>
  );
};


