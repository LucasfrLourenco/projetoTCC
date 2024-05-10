import React, { useState, useEffect } from "react";
import axios from "axios";

const Perfil = () => {
  const [usuario, setUsuario] = useState({});
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/perfil", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUsuario(response.data);
        setTelefone(response.data.telefone);
        setDescricao(response.data.descricao);
        setDisponivel(response.data.disponivel);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        "http://localhost:3001/perfil",
        {
          telefone,
          senha,
          descricao,
          disponivel,
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
    <div>
      <h2>Perfil do Usuário</h2>
      <p>Nome: {usuario.nome}</p>
      <input
        type="text"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />
      <input
        type="password"
        placeholder="Nova Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <label>
        Disponível:
        <input
          type="checkbox"
          checked={disponivel}
          onChange={(e) => setDisponivel(e.target.checked)}
        />
      </label>
      <button onClick={handleUpdate}>Atualizar</button>
    </div>
  );
};

export default Perfil;
