import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios"; 
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    try {
      const res = await API.post("/users/register", formData);
      
    
      const newToken = res.data.token;
      
      if (newToken) {
          localStorage.setItem("token", newToken);
          setToken(newToken);
      }

      toast.success(res.data.message || "Registration successful!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      throw err; 
    }
  };
  

  const login = async (formData) => {
    try {
      const res = await API.post("/users/login", formData);
      
      const newToken = res.data.token;

      if (newToken) {
          localStorage.setItem("token", newToken);
          setToken(newToken);
      }

      toast.success(res.data.message || "Login successful!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await API.get("/users/logout"); 
      
      setToken(null);
      localStorage.removeItem("token");

      toast.success("Logged out successfully.");
    } catch (err) {
      setToken(null);
      localStorage.removeItem("token");

      throw err; 
    }
  };

  const value = { token,  register, login, logout, loading };
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-600 font-semibold">Loading authentication state...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
