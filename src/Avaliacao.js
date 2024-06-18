import React, { useState } from "react";
import axios from "axios";
import "./Avaliacao.css";

const Avaliacao = ({ trabalhadorId, onAvaliado }) => {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  const handleAvaliacao = () => {
    if (nota === 0) {
      alert("Por favor, selecione uma nota.");
      return;
    }
    axios
      .post(
        "http://localhost:3001/avaliacao",
        { trabalhador_id: trabalhadorId, nota, comentario },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        alert("Avaliação enviada com sucesso");
        setNota(0);
        setComentario("");
        onAvaliado();
      })
      .catch((error) => {
        console.error("Erro ao enviar avaliação", error);
        alert("Erro ao enviar avaliação");
      });
  };

  return (
    <div className="avaliacao-container">
      <h3>Avaliar Trabalhador</h3>
      <div className="stars">
        {[...Array(5)].map((star, index) => (
          <span
            key={index}
            className={index < nota ? "filled" : "empty"}
            onClick={() => setNota(index + 1)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Comentário"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      ></textarea>
      <button className="buttonAval" onClick={handleAvaliacao}>
        Enviar Avaliação
      </button>
    </div>
  );
};

export default Avaliacao;
