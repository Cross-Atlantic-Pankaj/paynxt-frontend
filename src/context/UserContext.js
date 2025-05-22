'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('paynxt_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem('paynxt_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paynxt_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
