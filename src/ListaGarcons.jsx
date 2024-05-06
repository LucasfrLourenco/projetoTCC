import React from "react";
import "./ListaGarcons.css";

const ListaGarcons = () => {
  const garcons = [
    {
      id: 1,
      nome: "João",
      fotoPerfil: "./images/dog1.jpg", // Caminho para a foto de perfil do usuário
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional alho o tornam um profisam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissiona",
      idade: 28,
      tefefone: "4499450197",
      avaliacao: 4.5,
      trabalhosConcluidos: 10,
    },
    {
      id: 2,
      nome: "Maria",
      fotoPerfil: "./images/dog1.jpg", // Caminho para a foto de perfil do usuário
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado..",
      idade: 24,
      tefefone: "4499450197",
      avaliacao: 4,
      trabalhosConcluidos: 15,
    },
    {
      id: 3,
      nome: "Pedro",
      fotoPerfil: "/images/dog.jpg", // Caminho para a foto de perfil do usuário
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado..",
      idade: 32,
      tefefone: "4499450197",
      avaliacao: 2.3,
      trabalhosConcluidos: 12,
    },
  ];

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
                <img src={garcom.fotoPerfil} alt="Foto" />
              </div>
              <div>
                <h2>{garcom.nome}</h2>
                <p>Idade: {garcom.idade}</p>
                <p>Telefone: {garcom.tefefone}</p>
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
