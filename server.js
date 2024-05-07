const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware para analisar o corpo das solicitações POST
app.use(express.json());

// Use o middleware cors na sua aplicação Express
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bancotcc",
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado ao banco de dados MySQL");
});

// Rota para cadastrar usuário
app.post("/cadastro", (req, res) => {
  const { nome, cpfCnpj, telefone, email, senha } = req.body;
  const sql = `INSERT INTO usuarios (nome, cpfCnpj, telefone, email, senha) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [nome, cpfCnpj, telefone, email, senha], (err, result) => {
    if (err) {
      res.status(500).send("Erro ao cadastrar usuário");
    } else {
      res.status(200).send("Usuário cadastrado com sucesso");
    }
  });
});

// Rota para realizar login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;
  db.query(sql, [email, senha], (err, result) => {
    if (err) {
      res.status(500).send("Erro ao realizar login");
    } else {
      if (result.length > 0) {
        res.status(200).send("Login realizado com sucesso");
      } else {
        res.status(401).send("Email ou senha incorretos");
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
