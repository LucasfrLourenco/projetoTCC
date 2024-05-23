import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

  const handleLogin = () => {
    if (validateForm()) {
      axios
        .post("http://localhost:3001/login", {
          email,
          senha,
        })
        .then((response) => {
          alert("Logado");
          setRedirect(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
        })
        .catch((error) => {
          console.error(error);
          setErroLogin(error.response.data);
        });
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setErroLogin("Email não pode estar vazio");
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setErroLogin("Email inválido");
      valid = false;
    }

    if (!senha) {
      setErroLogin("Senha não pode estar vazia");
      valid = false;
    }

    return valid;
  };

  if (redirect) {
    return <Navigate to="/perfil" />;
  }

  return (
    <div className="input-container">
      <h2>Login</h2>
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input-field"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button className="submit-button" onClick={handleLogin}>
        Entrar
      </button>
      {erroLogin && <p className="error-message">{erroLogin}</p>}
    </div>
  );
};

export default Login;
