import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state for initial load

  useEffect(() => {
    // Check for token in local storage when the app loads
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers['Authorization'] = `Bearer ${token}`; // Set the token in the headers
      // Fetch the user data from the backend if token exists
      axios
        .get('/api/auth/me') // This endpoint should return the logged-in user info
        .then((response) => {
          setUser(response.data); // Set user state
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('authToken'); // Remove token if error occurs
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token); // Save the token in localStorage
      axios.defaults.headers['Authorization'] = `Bearer ${token}`; // Set token globally for axios
      setUser(user); // Set the user state
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setUser(null); // Reset user state
    axios.defaults.headers['Authorization'] = ''; // Clear token in axios headers
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
