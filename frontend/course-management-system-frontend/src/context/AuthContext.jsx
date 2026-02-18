import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the context (like a global variable)
const AuthContext = createContext();

// Wraps the whole app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When app loads, check if user was already logged in

  useEffect(() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // Add the check for the string "undefined"
  if (savedUser && savedUser !== "undefined" && token) {
    try {
      setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user'); // Clean up the bad data
    }
  }

  setLoading(false);
}, []);

  // Login function
  const login = async (email, password) => {
        try {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;

        // IMPORTANT: Check that they actually exist before saving!
        if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Update state
        setUser(user);

        return { success: true };

        } else {
        // This catches cases where the server sends back an empty body
        return { 
            success: false, 
            error: 'Server returned incomplete data' 
        };
        }

        } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Login failed'
        };
        }
    };

  // Register function
  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password }); 
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - makes using context easier
export const useAuth = () => useContext(AuthContext);