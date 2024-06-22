import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3001/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUserType(response.data.tipo);
          setUserId(response.data.userId); // Assume que o backend retorna userId
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUserType(null);
          setUserId(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, tipo, id) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUserType(tipo);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserType(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, userId, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
