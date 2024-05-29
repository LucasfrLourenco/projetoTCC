import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroCpfCnpj, setErroCpfCnpj] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleCadastro = () => {
    if (validateForm()) {
      axios
        .post("http://localhost:3001/cadastro", {
          nome,
          cpfCnpj,
          telefone,
          email,
          senha,
        })
        .then((response) => {
          alert("Usuário cadastrado com sucesso");
          navigate("/"); // Redireciona para a lista de garçons
        })
        .catch((error) => {
          console.error(error);
          setErroCadastro(error.response.data);
        });
    }
  };

  const validateForm = () => {
    let valid = true;

    // CPF/CNPJ validation
    if (!validarCpfCnpj(cpfCnpj)) {
      setErroCpfCnpj("CPF ou CNPJ inválido");
      valid = false;
    } else {
      setErroCpfCnpj("");
    }

    // Phone validation
    if (!/^\d{10,11}$/.test(telefone)) {
      setErroTelefone("Telefone inválido");
      valid = false;
    } else {
      setErroTelefone("");
    }

    // Email validation
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setErroEmail("Email inválido");
      valid = false;
    } else {
      setErroEmail("");
    }

    // Password validation
    if (senha.length < 6) {
      setErroSenha("Senha deve ter no mínimo 6 caracteres");
      valid = false;
    } else {
      setErroSenha("");
    }

    return valid;
  };

  const handleChangeCpfCnpj = (e) => {
    const valor = e.target.value;
    setCpfCnpj(valor);

    if (!validarCpfCnpj(valor)) {
      setErroCpfCnpj("CPF ou CNPJ inválido");
    } else {
      setErroCpfCnpj("");
    }
  };

  const validarCpfCnpj = (valor) => {
    const cpfCnpj = valor.replace(/\D/g, "");
    if (cpfCnpj.length <= 11) {
      return cpfCnpj.length === 11;
    } else {
      return cpfCnpj.length === 14;
    }
  };

  return (
    <div className="input-container">
      <h2>Cadastre-se</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="CPF ou CNPJ"
        value={cpfCnpj}
        onChange={handleChangeCpfCnpj}
        className="input-field"
      />
      {erroCpfCnpj && <p className="error-message">{erroCpfCnpj}</p>}
      <input
        type="tel"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className="input-field"
      />
      {erroTelefone && <p className="error-message">{erroTelefone}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      {erroEmail && <p className="error-message">{erroEmail}</p>}
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="input-field"
      />
      {erroSenha && <p className="error-message">{erroSenha}</p>}
      <button onClick={handleCadastro} className="submit-button">
        Cadastrar
      </button>
      {erroCadastro && <p className="error-message">{erroCadastro}</p>}
    </div>
  );
};

export default Cadastro;
