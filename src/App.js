import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ListaGarcons from "./ListaGarcons";
import Login from "./login";
import Cadastro from "./cadastro";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>
            <Link to="/">Garçonline</Link>
          </h1>
          <nav className="header-nav">
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/cadastro">Cadastrar</Link>
              </li>
            </ul>
          </nav>
        </header>

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
