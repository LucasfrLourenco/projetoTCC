import React from "react";
import "./Stars.css";

const Stars = ({ rating }) => {
  // Calcula quantas estrelas cheias, meia estrela e estrelas vazias devem ser renderizadas
  const fullStars = Math.floor(rating); // Estrelas cheias (parte inteira do rating)
  const halfStar = rating % 1 !== 0; // Verifica se há meia estrela (resto da divisão por 1 não é zero)
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Estrelas vazias necessárias para completar 5 estrelas

  return (
    <div className="stars">
      {[...Array(fullStars)].map((_, index) => (
        <span key={index} className="star filled">
          ★
        </span>
      ))}
      {halfStar && <span className="star half">★</span>}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={index} className="star empty">
          ★
        </span>
      ))}
    </div>
  );
};

export default Stars;
