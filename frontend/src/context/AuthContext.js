// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { API_URL } from 'constants';
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [ isAuthenticated, setIsAuthenticated ] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [ userRole, setUserRole ] = useState(() => {
    return localStorage.getItem('userRole');
  }); 

  // Mock sign-in function
  const signIn = async (username, password, endpoint) => {
    // Replace with actual authentication logic
    axios.post(API_URL + endpoint, {
      username:username, password:password
    }).then(response => {
      if (response.data?.data) {
        setIsAuthenticated(true);
        setUserRole(response.data.data.role);
        setUser(response.data.data);

        // Save user data and token to localStorage 
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', response.data.data.role);
  
      }
    }).catch(error => {
      console.log(error.response)
    })

  };

  // Sign-out function
  const signOut = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`, 
      },
      });
  
      // Clear user state and localStorage
      setUser(null);
      setUserRole(null); 
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    } catch (error) {
      console.log('Error during logout:', error.response);
    }
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
