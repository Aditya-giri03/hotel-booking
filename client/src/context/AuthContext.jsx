import React, { createContext, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Functions to update the state
  const login = (name, email) => {
    setName(name);
    setEmail(email);
  };

  const logout = () => {
    setName('');
    setEmail('');
  };

  // Provide the state and functions to the context
  return (
    <AuthContext.Provider value={{ name, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
