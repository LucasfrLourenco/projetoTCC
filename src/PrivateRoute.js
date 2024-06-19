import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner de carregamento, se preferir
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
