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
    const storedUserId = localStorage.getItem("userId"); // Adicionar recuperação do userId do localStorage
    if (token && storedUserId) {
      axios
        .get("http://localhost:3001/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUserType(response.data.tipo);
          setUserId(storedUserId); // Usar o userId armazenado no localStorage
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
    localStorage.setItem("userId", id); // Armazenar o userId no localStorage
    setIsAuthenticated(true);
    setUserType(tipo);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remover o userId do localStorage
    setIsAuthenticated(false);
    setUserType(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, userId, login, logout, loading }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
