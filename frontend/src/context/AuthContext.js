// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { API_URL } from 'constants';
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to your app
export const AuthProvider = ({ children }) => {
  
  const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const storedUserRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

  const [user, setUser] = useState(storedUser);
  const [ isAuthenticated, setIsAuthenticated ] = useState(storedToken);
  const [ userRole, setUserRole ] = useState(storedUserRole);

  const [authUserObj, setAuthUserObj] = useState({
    user: {},
    notifications: [],
    products: [],
  });

  const [error, setError] = useState(''); 
  const clearError = () => {
    setError(null);
  };

  // Mock sign-in function
  const signIn = async (username, password, endpoint, rememberMe) => {
    // Replace with actual authentication logic
    axios.post(API_URL + endpoint, {
      username:username, password:password
    }).then(response => {
      if (response.data?.data) {
        setIsAuthenticated(true);
        setUserRole(response.data.data.role);
        setUser(response.data.data);

        // Save user data and token to localStorage 
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(response.data.data));
        storage.setItem('token', response.data.data.token);
        storage.setItem('userRole', response.data.data.role);
        setError('');
      }   
    }).catch(error => {
      console.log(error.response)
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Invalid username or password.');
      } else {
        setError('An error occurred while logging in. Please try again.');
      }
    })

  };

  // Sign-out function
  const signOut = async (navigate) => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`, 
      },
      });
  
      const role = userRole; 
      // Navigate to the appropriate sign-in page
      if (role === 'admin') {
        navigate('/admin/sign-in');
      } else if (role === 'customer') {
        navigate('/customer/sign-in');
      }
      // Clear user state and localStorage
      setUser(null);
      setUserRole(null); 
      setIsAuthenticated(false);
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.log('Error during logout:', error.response);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, signIn, signOut , error, clearError, authUserObj, setAuthUserObj}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
