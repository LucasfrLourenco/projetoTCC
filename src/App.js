import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import ListaGarcons from "./ListaGarcons";
import Cadastro from "./cadastro";
import Login from "./login";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/cadastro" component={Cadastro} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={ListaGarcons} />
          {/* Adicione mais rotas conforme necessário */}
          {/* Por exemplo: <Route path="/outra-rota" component={OutroComponente} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
