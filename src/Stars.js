import React from "react";
import "./Stars.css";

const Stars = ({ rating }) => {
  return (
    <div className="stars">
      {[...Array(5)].map((star, index) => (
        <span key={index} className={index < rating ? "filled" : "empty"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default Stars;
