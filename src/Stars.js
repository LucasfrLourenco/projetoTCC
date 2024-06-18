import React from "react";
import "./Stars.css";

const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

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
