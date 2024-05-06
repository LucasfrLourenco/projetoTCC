import React from "react";
import "./ListaGarcons.css";

const ListaGarcons = () => {
  const garcons = [
    {
      id: 1,
      nome: "João",
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional alho o tornam um profisam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissionaam um profissiona",
      idade: 28,
      avaliacao: 4.5,
      trabalhosConcluidos: 10,
    },
    {
      id: 2,
      nome: "Maria",
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado..",
      idade: 24,
      avaliacao: 4.7,
      trabalhosConcluidos: 15,
    },
    {
      id: 3,
      nome: "Pedro",
      descricao:
        "Pedro possui mais de 5 anos de experiência como garçom em diversos tipos de estabelecimentos, desde restaurantes familiares a eventos de grande porte. Sua habilidade em lidar com clientes e sua dedicação ao trabalho o tornam um profissional altamente qualificado..",
      idade: 32,
      avaliacao: 4.3,
      trabalhosConcluidos: 12,
    },
  ];

  return (
    <div>
      <div className="garcons-container">
        {garcons.map((garcom) => (
          <div key={garcom.id} className="garcon-card">
            <div className="garcon-info">
              <h2>{garcom.nome}</h2>
              <p>Idade: {garcom.idade}</p>
              <p>Trabalhos Concluídos: {garcom.trabalhosConcluidos}</p>
              <p>Avaliação: {garcom.avaliacao} estrelas</p>
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
