import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Avaliacao from "./Avaliacao";
import Stars from "./Stars";
import "./DetalhesTrabalhador.css";

const DetalhesTrabalhador = () => {
  const { id } = useParams();
  const [trabalhador, setTrabalhador] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(null);
  const [mostrarMais, setMostrarMais] = useState(false);
  const { isAuthenticated, userType } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trabalhadorResponse = await axios.get(
          `http://localhost:3001/trabalhador/${id}`
        );
        setTrabalhador(trabalhadorResponse.data);

        const avaliacoesResponse = await axios.get(
          `http://localhost:3001/avaliacoes/${id}`
        );
        setAvaliacoes(avaliacoesResponse.data);

        const mediaResponse = await axios.get(
          `http://localhost:3001/avaliacoes/media/${id}`
        );
        setMediaAvaliacao(mediaResponse.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do trabalhador:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAvaliado = async () => {
    try {
      const avaliacoesResponse = await axios.get(
        `http://localhost:3001/avaliacoes/${id}`
      );
      setAvaliacoes(avaliacoesResponse.data);

      const mediaResponse = await axios.get(
        `http://localhost:3001/avaliacoes/media/${id}`
      );
      setMediaAvaliacao(mediaResponse.data);
    } catch (error) {
      console.error("Erro ao atualizar avaliações:", error);
    }
  };

  const avaliacoesExibidas = mostrarMais ? avaliacoes : avaliacoes.slice(0, 2);

  if (!trabalhador) {
    return <p>Carregando...</p>;
  }

  const enviarWhatsApp = () => {
    const telefone = trabalhador.telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
    const mensagem = `Olá, ${trabalhador.nome}! eu vi seu perfil no Garçonline e me interessei. Gostaria de conversar com você. Esta disponível?`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="detalhes-container">
      {trabalhador.imagem && (
        <img
          src={`http://localhost:3001/imagens/${trabalhador.imagem}`}
          alt="Imagem do Trabalhador"
          className="trabalhador-imagem"
        />
      )}
      <div className="detalhes-info">
        <h1 className="trabalhador-nome">{trabalhador.nome}</h1>
        <p className="trabalhador-idade">Idade: {trabalhador.idade} anos</p>
        <p className="trabalhador-email">Email: {trabalhador.email}</p>
        <p className="trabalhador-telefone">
          Telefone: {trabalhador.telefone}
          {isAuthenticated && userType === "PJ" && (
            <button className="whatsapp-button" onClick={enviarWhatsApp}>
              Enviar Mensagem
            </button>
          )}
        </p>
        <p className="trabalhador-categoria">
          Categoria: {trabalhador.categoria}
        </p>
        {trabalhador.descricao ? (
          <p className="trabalhador-descricao">
            Descrição: {trabalhador.descricao}
          </p>
        ) : (
          <p>Sem descrição</p>
        )}
        {trabalhador.disponivel ? (
          <p style={{ color: "green" }} className="trabalhador-disponivel">
            Disponível
          </p>
        ) : (
          <p className="trabalhador-indisponivel">Indisponível</p>
        )}
        <div className="media-avaliacao">
          <h3>Média das Avaliações:</h3>
          {mediaAvaliacao !== null ? (
            <>
              <Stars rating={Math.round(mediaAvaliacao)} />
              <p>{mediaAvaliacao.toFixed(1)} estrelas</p>
            </>
          ) : (
            <p>Ainda não avaliado</p>
          )}
        </div>
      </div>
      <div className="avaliacoes-container">
        <h2>Avaliações</h2>
        {avaliacoes.length > 0 ? (
          avaliacoesExibidas.map((avaliacao, index) => (
            <div key={index} className="avaliacao">
              <Stars rating={avaliacao.nota} />
              <p>
                <strong>{avaliacao.avaliador}:</strong> {avaliacao.comentario}
              </p>
            </div>
          ))
        ) : (
          <p>Sem avaliações</p>
        )}
        {avaliacoes.length > 2 && (
          <button onClick={() => setMostrarMais(!mostrarMais)}>
            {mostrarMais ? "Mostrar Menos" : "Mostrar Mais"}
          </button>
        )}
        {isAuthenticated && userType === "PJ" && (
          <Avaliacao trabalhadorId={id} onAvaliado={handleAvaliado} />
        )}
      </div>
    </div>
  );
};

export default DetalhesTrabalhador;
