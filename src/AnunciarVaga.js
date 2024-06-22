import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import "./AnunciarVaga.css";

const AnunciarVaga = () => {
  const [funcao, setFuncao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataNecessaria, setDataNecessaria] = useState("");
  const { isAuthenticated, userType } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || userType !== "PJ") {
      alert("Apenas usuários PJ podem anunciar vagas");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/vagas",
        {
          funcao,
          descricao,
          data_necessaria: dataNecessaria,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Vaga anunciada com sucesso");
      setFuncao("");
      setDescricao("");
      setDataNecessaria("");
    } catch (error) {
      console.error("Erro ao anunciar vaga:", error);
      alert("Erro ao anunciar vaga");
    }
  };

  return (
    <div className="anunciar-vaga-container">
      <h2>Anunciar Vaga</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Função:</label>
          <input
            type="text"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Data Necessária:</label>
          <input
            type="date"
            value={dataNecessaria}
            onChange={(e) => setDataNecessaria(e.target.value)}
            required
          />
        </div>
        <button type="submit">Anunciar Vaga</button>
      </form>
    </div>
  );
};

export default AnunciarVaga;
