import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./DetalhesTrabalhador.css";

const DetalhesTrabalhador = () => {
  const { id } = useParams();
  const [trabalhador, setTrabalhador] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/trabalhador/${id}`)
      .then((response) => {
        setTrabalhador(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes do trabalhador:", error);
      });
  }, [id]);

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
          <p className="trabalhador-disponivel">Disponível</p>
        ) : (
          <p className="trabalhador-indisponivel">Indisponível</p>
        )}
      </div>
    </div>
  );
};

export default DetalhesTrabalhador;
