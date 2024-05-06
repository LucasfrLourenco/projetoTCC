import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListaGarcons from "./ListaGarcons";
import Cadastro from "./cadastro";
import Login from "./login";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ListaGarcons />} />
          {/* Adicione mais rotas conforme necessário */}
          {/* Por exemplo: <Route path="/outra-rota" element={<OutroComponente />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
