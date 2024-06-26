import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./global.css";

const Cadastro = () => {
  const [tipo, setTipo] = useState("PJ");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idade, setIdade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [erroCpfCnpj, setErroCpfCnpj] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = () => {
    if (validateForm()) {
      const data = {
        nome,
        cpfCnpj,
        telefone: telefone.replace(/\D/g, ""), // Remove máscara antes de enviar
        email,
        senha,
        tipo,
        idade: tipo === "PF" ? idade : null,
        categoria: tipo === "PF" ? categoria : null,
      };

      axios
        .post("http://localhost:3001/cadastro", data)
        .then((response) => {
          alert("Usuário cadastrado com sucesso");
          navigate("/login");
        })
        .catch((error) => {
          console.error(error);
          setErroCadastro(error.response.data);
        });
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!validarCpfCnpj(cpfCnpj)) {
      setErroCpfCnpj("CPF ou CNPJ inválido");
      valid = false;
    } else {
      setErroCpfCnpj("");
    }

    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) {
      setErroTelefone("Telefone inválido");
      valid = false;
    } else {
      setErroTelefone("");
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setErroEmail("Email inválido");
      valid = false;
    } else {
      setErroEmail("");
    }

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

  const handleChangeTelefone = (e) => {
    const valor = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    let telefoneFormatado = valor;

    if (valor.length > 2) {
      telefoneFormatado = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}`;
    }
    if (valor.length > 7) {
      telefoneFormatado = `(${valor.slice(0, 2)}) ${valor.slice(
        2,
        7
      )}-${valor.slice(7, 11)}`;
    }

    setTelefone(telefoneFormatado);
  };

  return (
    <div className="input-container">
      <h2>Cadastre-se</h2>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="input-field"
      >
        <option value="PJ">Pessoa Jurídica</option>
        <option value="PF">Pessoa Física</option>
      </select>
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
        onChange={handleChangeTelefone}
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
      {tipo === "PF" && (
        <>
          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            className="input-field"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-field"
          >
            <option value="">Selecione a Categoria</option>
            <option value="Garçom">Garçom</option>
            <option value="Cozinheiro">Cozinheiro</option>
            <option value="Atendente">Atendente</option>
            <option value="Chefe de Cozinha">Chefe de Cozinha</option>
            <option value="Sushiman">Sushiman</option>
            <option value="Pizzaiolo">Pizzaiolo</option>
            <option value="Churrasqueiro">Churrasqueiro</option>
            <option value="Auxiliar de Cozinha">Auxiliar de Cozinha</option>
            <option value="Entregador">Entregador</option>
          </select>
        </>
      )}
      <button onClick={handleCadastro} className="submit-button">
        Cadastrar
      </button>
      {erroCadastro && <p className="error-message">{erroCadastro}</p>}
    </div>
  );
};

export default Cadastro;
