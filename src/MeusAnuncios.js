import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const MeusAnuncios = () => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  const [minhasVagas, setMinhasVagas] = useState([]);

  useEffect(() => {
    const fetchMinhasVagas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!userId) return; // Adicionado para evitar requisição sem userId
        console.log("Token:", token); // Verifique o token
        console.log("userId:", userId); // Verifique o userId
        const response = await axios.get(
          `http://localhost:3001/vagas/meu-anuncio/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Vagas recebidas:", response.data); // Verifique o resultado
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

  return (
    <div>
      <h2>Minhas Vagas Anunciadas</h2>
      <ul>
        {minhasVagas.length > 0 ? (
          minhasVagas.map((vaga) => (
            <li key={vaga.id}>
              <p>{vaga.funcao}</p>
              <p>{vaga.descricao}</p>
              <p>
                Data Necessária:{" "}
                {new Date(vaga.data_necessaria).toLocaleDateString()}
              </p>
              <button onClick={() => handleRemoverVaga(vaga.id)}>
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
