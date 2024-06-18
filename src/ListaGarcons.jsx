import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListaGarcons.css"; // Importa o arquivo CSS

const ListaGarcons = () => {
  const [trabalhadores, setTrabalhadores] = useState([]);

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

  return (
    <div className="trabalhadores-container">
      <ul className="trabalhadores-list">
        {trabalhadores.map((trabalhador) => (
          <li key={trabalhador.id} className="trabalhador-card">
            <Link to={`/trabalhador/${trabalhador.id}`}>
              <h1 className="trabalhador-nome">{trabalhador.nome}</h1>
              <p className="trabalhador-idade">
                Idade: {trabalhador.idade} Anos
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
