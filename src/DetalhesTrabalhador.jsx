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
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [mostrarMais, setMostrarMais] = useState(false);
  const { isAuthenticated, userType } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/trabalhador/${id}`)
      .then((response) => {
        setTrabalhador(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes do trabalhador:", error);
      });

    axios
      .get(`http://localhost:3001/avaliacoes/${id}`)
      .then((response) => {
        setAvaliacoes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar avaliações:", error);
      });

    axios
      .get(`http://localhost:3001/avaliacoes/media/${id}`)
      .then((response) => {
        setMediaAvaliacao(response.data);
      })
      .catch((error) => {
        console.error("Erro ao calcular média das avaliações:", error);
      });
  }, [id]);

  const handleAvaliado = () => {
    axios
      .get(`http://localhost:3001/avaliacoes/${id}`)
      .then((response) => {
        setAvaliacoes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar avaliações:", error);
      });

    axios
      .get(`http://localhost:3001/avaliacoes/media/${id}`)
      .then((response) => {
        setMediaAvaliacao(response.data);
      })
      .catch((error) => {
        console.error("Erro ao calcular média das avaliações:", error);
      });
  };

  const avaliacoesExibidas = mostrarMais ? avaliacoes : avaliacoes.slice(0, 2);

  if (!trabalhador) {
    return <p>Carregando...</p>;
  }

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
        <p className="trabalhador-idade">Idade: {trabalhador.idade} Anos</p>
        <p className="trabalhador-telefone">Telefone: {trabalhador.telefone}</p>
        <p className="trabalhador-categoria">
          Categoria: {trabalhador.categoria}
        </p>
        <p className="trabalhador-descricao">
          Descrição: {trabalhador.descricao}
        </p>
        {trabalhador.disponivel ? (
          <p style={{ color: "green" }} className="trabalhador-disponivel">
            Disponível
          </p>
        ) : (
          <p className="trabalhador-indisponivel">Indisponível</p>
        )}
        <div className="media-avaliacao">
          <h3>Média das Avaliações:</h3>
          <Stars rating={Math.round(mediaAvaliacao)} />
          <p>{mediaAvaliacao.toFixed(1)} estrelas</p>
        </div>
      </div>
      <div className="avaliacoes-container">
        <h2>Avaliações</h2>
        {avaliacoesExibidas.map((avaliacao, index) => (
          <div key={index} className="avaliacao">
            <Stars rating={avaliacao.nota} />
            <p>
              <strong>{avaliacao.avaliador}:</strong> {avaliacao.comentario}
            </p>
          </div>
        ))}
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
