import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ListaGarcons.css"; // Importa o arquivo CSS
import defaultImage from "./images/default.png";

const ListaGarcons = () => {
  const [trabalhadores, setTrabalhadores] = useState([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const categoriasFixas = [
    "Garçom",
    "Cozinheiro",
    "Atendente",
    "Chefe de Cozinha",
    "Sushiman",
    "Pizzaiolo",
    "Churrasqueiro",
    "Auxiliar de Cozinha",
    "Entregador",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/trabalhadores")
      .then((response) => {
        setTrabalhadores(response.data);
      })
      .catch((error) => {
        console.error(
          "Erro ao buscar trabalhadores:",
          error.response ? error.response.data : error.message
        );
      });
  }, []);

  const handleNomeChange = (e) => {
    setNomeFiltro(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoriaFiltro(e.target.value);
  };

  const trabalhadoresFiltrados = trabalhadores.filter((trabalhador) => {
    return (
      trabalhador.nome.toLowerCase().includes(nomeFiltro.toLowerCase()) &&
      (categoriaFiltro === "" || trabalhador.categoria === categoriaFiltro)
    );
  });

  const getImagemUrl = (nomeImagem) => {
    if (nomeImagem && trabalhadores.find((t) => t.imagem === nomeImagem)) {
      return `http://localhost:3001/imagens/${nomeImagem}`;
    }
    return defaultImage;
  };

  return (
    <div className="trabalhadores-container">
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={nomeFiltro}
          onChange={handleNomeChange}
          className="filtro-input"
        />
        <select
          value={categoriaFiltro}
          onChange={handleCategoriaChange}
          className="filtro-select"
        >
          <option value="">Todas as categorias</option>
          {categoriasFixas.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>
      <ul className="trabalhadores-list">
        {trabalhadoresFiltrados.map((trabalhador) => (
          <li key={trabalhador.id} className="trabalhador-card">
            <Link to={`/trabalhador/${trabalhador.id}`}>
              {trabalhador.imagem ? (
                <img
                  src={getImagemUrl(trabalhador.imagem)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  alt="Imagem do Trabalhador"
                  className="trabalhador-imagem"
                />
              ) : (
                <img
                  src={defaultImage}
                  alt="Imagem Padrão"
                  className="trabalhador-imagem"
                />
              )}
              <h1 className="trabalhador-nome">{trabalhador.nome}</h1>
              <p className="trabalhador-idade">
                Idade: {trabalhador.idade} anos
              </p>
              <p className="trabalhador-categoria">
                Categoria: {trabalhador.categoria}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaGarcons;
