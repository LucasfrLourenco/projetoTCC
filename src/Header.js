// Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="App-header">
      <h1>
        <Link to="/">Garçonline</Link>
      </h1>
      <nav className="header-nav">
        <ul>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/cadastro">Cadastrar</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/perfil">Perfil</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
