import React, { useState } from "react";
import axios from "axios";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroCpfCnpj, setErroCpfCnpj] = useState("");

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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const validarCpfCnpj = (valor) => {
    const cpfCnpj = valor.replace(/\D/g, '');
    if (cpfCnpj.length <= 11) {
      return cpfCnpj.length === 11;
    } else {
      return cpfCnpj.length === 14;
    }
  };

  const handleChangeCpfCnpj = (e) => {
    const valor = e.target.value;
    setCpfCnpj(valor);

    if (!validarCpfCnpj(valor)) {
      setErroCpfCnpj('CPF ou CNPJ inválido');
    } else {
      setErroCpfCnpj('');
    }
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
        type="number"
        placeholder="CPF ou CNPJ"
        value={cpfCnpj}
        onChange={handleChangeCpfCnpj}
      />
      {erroCpfCnpj && <p style={{ color: 'red' }}>{erroCpfCnpj}</p>}
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