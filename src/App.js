// App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ListaGarcons from "./ListaGarcons";
import Login from "./Login";
import Cadastro from "./cadastro";
import Perfil from "./Perfil";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider, AuthContext } from "./AuthContext";
import Header from "./Header";
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
