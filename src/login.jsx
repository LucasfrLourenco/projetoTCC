import React, { useState } from "react";
import "./cadastro";
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    // Implemente a lógica de login aqui (comunicação com o backend)
    console.log("Email:", email);
    console.log("Senha:", senha);
  };

  return (
    <div className="input-container">
      <h2>Login</h2> {/* Adicione uma classe de contêiner para os inputs */}
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
