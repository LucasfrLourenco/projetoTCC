import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/AuthContext";
import "./AnunciarVaga.css";

const AnunciarVaga = () => {
  const [funcao, setFuncao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const { isAuthenticated, userType } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || userType !== "PJ") {
      alert("Apenas usuários PJ podem anunciar vagas");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (dataInicial < today || dataFinal < today) {
      alert("As datas devem ser de hoje em diante");
      return;
    }

    if (dataInicial > dataFinal) {
      alert("A data inicial não pode ser maior que a data final");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/vagas",
        {
          funcao,
          descricao,
          data_inicial: dataInicial,
          data_final: dataFinal,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Vaga anunciada com sucesso");
      setFuncao("");
      setDescricao("");
      setDataInicial("");
      setDataFinal("");
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
          <select
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            required
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
          </select>
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
          <label>Data Inicial:</label>
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data Final:</label>
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            required
          />
        </div>
        <button type="submit">Anunciar Vaga</button>
      </form>
    </div>
  );
};

export default AnunciarVaga;
