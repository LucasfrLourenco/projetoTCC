// Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./header.css";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="App-header">
      <h1>
        <Link to="/">Garçonline</Link>
      </h1>
      <nav className="header-nav">
        <ul className="nav-list">
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">LOGIN</Link>
              </li>
              <li>
                <Link to="/cadastro">CADASTRE-SE</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/perfil">PERFIL</Link>
              </li>
              <li>
                <button className="logout-button" onClick={logout}>SAIR</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
