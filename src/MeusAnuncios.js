import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "./MeusAnuncios.css";

const MeusAnuncios = () => {
  const { userId, isAuthenticated, loading } = useContext(AuthContext);
  const [minhasVagas, setMinhasVagas] = useState([]);

  useEffect(() => {
    const fetchMinhasVagas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!userId) return;
        const response = await axios.get(
          `http://localhost:3001/vagas/meu-anuncio/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMinhasVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar minhas vagas:", error);
      }
    };

    if (isAuthenticated && userId) {
      fetchMinhasVagas();
    }
  }, [userId, isAuthenticated]);

  const handleRemoverVaga = async (vagaId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/vagas/${vagaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMinhasVagas(minhasVagas.filter((vaga) => vaga.id !== vagaId));
      alert("Vaga removida com sucesso");
    } catch (error) {
      console.error("Erro ao remover vaga:", error);
      alert("Erro ao remover vaga");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="meus-anuncios-container">
      <h2>Minhas Vagas Anunciadas</h2>
      <ul className="vagas-list">
        {minhasVagas.length > 0 ? (
          minhasVagas.map((vaga) => (
            <li key={vaga.id} className="vaga-card">
              <div className="vaga-info">
                <p className="vaga-funcao">{vaga.funcao}</p>
                <p className="vaga-descricao">{vaga.descricao}</p>
                <p className="vaga-data">
                  Data Necessária:{" "}
                  {new Date(vaga.data_necessaria).toLocaleDateString()}
                </p>
              </div>
              <button
                className="remover-vaga-button"
                onClick={() => handleRemoverVaga(vaga.id)}
              >
                Remover Vaga
              </button>
            </li>
          ))
        ) : (
          <p>Você não tem vagas anunciadas.</p>
        )}
      </ul>
    </div>
  );
};

export default MeusAnuncios;
