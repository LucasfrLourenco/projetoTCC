import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListaGarcons.css";

const ListaGarcons = () => {
  const [garcons, setGarcons] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/garcons")
      .then((response) => {
        setGarcons(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter lista de garçons:", error);
      });
  }, []);

  const renderEstrelas = (avaliacao) => {
    const estrelas = [];
    for (let i = 0; i < 5; i++) {
      if (i < avaliacao) {
        estrelas.push(<span key={i}>&#9733;</span>); // Estrela preenchida
      } else {
        estrelas.push(<span key={i}>&#9734;</span>); // Estrela vazia
      }
    }
    return estrelas;
  };

  return (
    <div>
      <div className="garcons-container">
        {garcons.map((garcom) => (
          <div key={garcom.id} className="garcon-card">
            <div className="garcon-info">
              <div className="profile-picture">
                <img
                  src={garcom.fotoPerfil || "/images/default-profile.jpg"}
                  alt="Foto"
                />
              </div>
              <div>
                <h2>{garcom.nome}</h2>
                <p>Idade: {garcom.idade}</p>
                <p>Telefone: {garcom.telefone}</p>
                <p>Trabalhos Concluídos: {garcom.trabalhosConcluidos}</p>
                <div className="garcon-rating">
                  Avaliação: {renderEstrelas(garcom.avaliacao)}
                </div>
              </div>
            </div>
            <div className="garcon-description">
              <p>{garcom.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaGarcons;
