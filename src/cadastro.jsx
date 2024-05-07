import React, { useState } from "react";
import axios from "axios";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = () => {
    axios
      .post("http://localhost:3001/cadastro", {
        nome,
        cpfCnpj,
        telefone,
        email,
        senha,
      })
      .then((response) => {
        console.log(response.data);
        // Adicione aqui o código para redirecionar o usuário após o cadastro, se necessário
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="input-container">
      <h2>Cadastro</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="CPF ou CNPJ"
        value={cpfCnpj}
        onChange={(e) => setCpfCnpj(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleCadastro}>Cadastrar</button>
    </div>
  );
};

export default Cadastro;
