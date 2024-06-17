import React, { useState, useEffect } from "react";
import axios from "axios";

const Perfil = () => {
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch profile data on mount
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { telefone, descricao, disponivel } = response.data;
        setTelefone(telefone);
        setDescricao(descricao);
        setDisponivel(disponivel);
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        setError("Erro ao carregar perfil");
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.put(
        "http://localhost:3001/perfil",
        { telefone, senha, descricao, disponivel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      setError("Erro ao atualizar perfil. Por favor, tente novamente.");
    }
  };

  return (
    <div className="perfil-container">
      <form onSubmit={handleUpdate}>
        <h2>Perfil</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>
        <label>
          Disponível:
          <input
            type="checkbox"
            checked={disponivel}
            onChange={(e) => setDisponivel(e.target.checked)}
          />
        </label>
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
};

export default Perfil;
