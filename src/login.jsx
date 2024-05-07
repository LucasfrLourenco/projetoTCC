import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    axios
      .post("http://localhost:3001/login", {
        email,
        senha,
      })
      .then((response) => {
        console.log(response.data);
        // Adicione aqui o código para redirecionar o usuário após o login, se necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
