import React, { useState, useEffect } from "react";
import axios from "axios";
import "./perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState({});
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    axios
      .get("http://localhost:3001/perfil", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUsuario(response.data);
        setTelefone(response.data.telefone || "");
        setDescricao(response.data.descricao || "");
        setDisponivel(response.data.disponivel || false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    axios
      .put(
        "http://localhost:3001/perfil",
        {
          telefone,
          senha,
          descricao,
          disponivel,
          userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <h2>Perfil do Usuário</h2>
        <p>Nome: {usuario.nome}</p>
        <input
          className="input-field"
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Nova Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <textarea
          className="textarea-field"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <label className="checkbox-label">
          Disponível:
          <input
            type="checkbox"
            checked={disponivel}
            onChange={(e) => setDisponivel(e.target.checked)}
          />
        </label>
        <button className="update-button" onClick={handleUpdate}>
          Atualizar
        </button>
      </div>

    </div>
  );
};

export default Perfil;
