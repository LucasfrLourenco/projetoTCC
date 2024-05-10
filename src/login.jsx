import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleLogin = () => {
    axios
      .post("http://localhost:3001/login", {
        email,
        senha,
      })
      .then((response) => {
        alert("Logado");
        setRedirect(true);
        // Verificando se o token está sendo recebido corretamente
        console.log("Token recebido:", response.data.token);
        // Armazenando o token no localStorage
        localStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        console.error(error);
        alert("Senha ou email incorretos");
      });
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
      <button className="button" onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
};

export default Login;
