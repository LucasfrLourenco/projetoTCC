const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
app.post("/cadastro", async (req, res) => {
  const { nome, cpfCnpj, telefone, email, senha } = req.body;

  try {
    // Criptografando a senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    const sql = `INSERT INTO usuarios (nome, cpfCnpj, telefone, email, senha) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      sql,
      [nome, cpfCnpj, telefone, email, hashedSenha],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Erro ao cadastrar usuário");
        } else {
          res.status(200).send("Usuário cadastrado com sucesso");
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

// Rota para realizar login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
      if (err) {
        res.status(500).send("Erro ao realizar login");
      } else {
        if (result.length > 0) {
          // Verificando a senha criptografada
          const usuario = result[0];
          const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

          if (senhaCorreta) {
            // Gerando token de autenticação
            const token = jwt.sign({ id: usuario.id }, "segredo", {
              expiresIn: "1h",
            });
            res.status(200).json({ token });
          } else {
            res.status(401).send("Senha incorreta");
          }
        } else {
          res.status(404).send("Usuário não encontrado");
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao realizar login");
  }
});

// Middleware para verificar o token de autenticação
function verificarToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token, "segredo", (err, decoded) => {
    if (err) {
      return res.status(403).send("Token inválido");
    }
    req.userId = decoded.id;
    next();
  });
}

// Rota para perfil do usuário
app.get("/perfil", verificarToken, (req, res) => {
  // Lógica para retornar o perfil do usuário
  res.status(200).send("Página de perfil do usuário");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
