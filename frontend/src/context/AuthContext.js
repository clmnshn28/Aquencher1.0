// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { API_URL } from 'constants';
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ userRole, setUserRole ] = useState(null);

  // Mock sign-in function
  const signIn = async (username, password) => {
    // Replace with actual authentication logic
    axios.post(API_URL + '/api/login', {
      username:username, password:password
    }).then(response => {
      if (response.data?.data) {
        setIsAuthenticated(true);
        setUserRole(response.data.data.role);
        setUser(response.data.data);
      }
    }).catch(error => {
      console.log(error.response)
    })

  };

  // Sign-out function
  const signOut = () => {
    setUser(null);
    console.log('User after sign out:', user);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
