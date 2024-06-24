import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListaVagas.css";

const ListaVagas = () => {
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await axios.get("http://localhost:3001/vagas");
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    fetchVagas();
  }, []);

  const enviarMensagem = (empresaNome, empresaTelefone) => {
    const telefone = empresaTelefone.replace(/\D/g, ""); // Remove caracteres não numéricos
    const mensagem = `Olá, ${empresaNome}! Eu vi seu anúncio de vaga no Garçonline e estou interessado. Gostaria de conversar sobre a oportunidade.`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="vagas-container">
      <h2>Vagas Disponíveis</h2>
      <ul className="vagas-list">
        {vagas.map((vaga) => (
          <li key={vaga.id} className="vaga-card">
            <div>
              <h3>{vaga.funcao}</h3>
              <p>
                Data Inicial: {new Date(vaga.data_inicial).toLocaleDateString()}
              </p>
              <p>
                Data Final: {new Date(vaga.data_final).toLocaleDateString()}
              </p>
              <p>Descrição: {vaga.descricao}</p>
              <p>Empresa: {vaga.empresa_nome}</p>
              <button
                className="contato-button"
                onClick={() =>
                  enviarMensagem(vaga.empresa_nome, vaga.empresa_telefone)
                }
              >
                Entrar em Contato
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaVagas;
