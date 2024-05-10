const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bancotcc",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado ao banco de dados MySQL");
});

app.post("/cadastro", async (req, res) => {
  const { nome, cpfCnpj, telefone, email, senha } = req.body;

  try {
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

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
      if (err) {
        res.status(500).send("Erro ao realizar login");
      } else {
        if (result.length > 0) {
          const usuario = result[0];
          const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

          if (senhaCorreta) {
            const token = jwt.sign({ id: usuario.id }, "segredo", {
              expiresIn: "1h",
            });
            res.status(200).json({ token, userId: usuario.id });
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
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
      if (err) {
        res.status(500).send("Erro ao realizar login");
      } else {
        if (result.length > 0) {
          const usuario = result[0];
          const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

          if (senhaCorreta) {
            const token = jwt.sign({ id: usuario.id }, "segredo", {
              expiresIn: "1h",
            });
            res.status(200).json({ token, userId: usuario.id });
            // Armazenando o token JWT e o ID do usuário no localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userId", usuario.id);
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

app.get("/perfil", verificarToken, (req, res) => {
  const userId = req.userId;

  const sql = `SELECT * FROM usuarios WHERE id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao obter perfil do usuário");
    } else {
      const usuario = result[0];
      res.status(200).json(usuario);
    }
  });
});

app.put("/perfil", verificarToken, (req, res) => {
  const { telefone, senha, descricao, disponivel } = req.body;
  const userId = req.userId;

  const sql = `UPDATE usuarios SET telefone = ?, senha = ?, descricao = ?, disponivel = ? WHERE id = ?`;
  db.query(
    sql,
    [telefone, senha, descricao, disponivel, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar perfil do usuário");
      } else {
        res.status(200).send("Perfil do usuário atualizado com sucesso");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
