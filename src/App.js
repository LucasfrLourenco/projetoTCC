// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListaGarcons from "./ListaGarcons";
import Login from "./Login";
import Cadastro from "./cadastro";
import Perfil from "./Perfil";
import AnunciarVaga from "./AnunciarVaga";
import ListaVagas from "./ListaVagas";
import MeusAnuncios from "./MeusAnuncios"; // Importar o componente MeusAnuncios
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./AuthContext";
import Header from "./Header";
import DetalhesTrabalhador from "./DetalhesTrabalhador";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/perfil"
                element={<PrivateRoute element={<Perfil />} />}
              />
              <Route
                path="/trabalhador/:id"
                element={<DetalhesTrabalhador />}
              />
              <Route
                path="/anunciar-vaga"
                element={<PrivateRoute element={<AnunciarVaga />} />}
              />
              <Route path="/vagas" element={<ListaVagas />} />
              <Route
                path="/meus-anuncios"
                element={
                  <PrivateRoute
                    element={<MeusAnuncios />}
                    userTypeAllowed={["PJ"]}
                  />
                }
              />
              <Route path="/" element={<ListaGarcons />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>© 2024 Garçonline. Todos os direitos reservados.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
