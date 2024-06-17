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

// Middleware para verificar token
function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token.split(" ")[1], "segredo", (err, decoded) => {
    if (err) {
      return res.status(403).send("Token inválido");
    }
    req.userId = decoded.id;
    console.log("Decoded user ID:", req.userId); // Log para depuração
    next();
  });
}

// Rota de cadastro com validação de usuário existente
app.post("/cadastro", async (req, res) => {
  const { nome, cpfCnpj, telefone, email, senha, tipo, idade, categoria } =
    req.body;

  try {
    // Verificar se já existe um usuário com o mesmo email ou CPF/CNPJ
    const sqlCheck = `SELECT * FROM usuarios WHERE email = ? OR cpfCnpj = ?`;
    db.query(sqlCheck, [email, cpfCnpj], async (err, result) => {
      if (err) {
        return res.status(500).send("Erro ao verificar usuário");
      }

      if (result.length > 0) {
        return res
          .status(400)
          .send("Usuário já cadastrado com este email ou CPF/CNPJ");
      }

      const hashedSenha = await bcrypt.hash(senha, 10);

      const sqlInsert = `INSERT INTO usuarios (nome, cpfCnpj, telefone, email, senha, tipo, idade, categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        sqlInsert,
        [nome, cpfCnpj, telefone, email, hashedSenha, tipo, idade, categoria],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Erro ao cadastrar usuário");
          }
          res.status(200).send("Usuário cadastrado com sucesso");
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

// Rota de login com validação
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).send("Erro ao realizar login");
      }

      if (result.length > 0) {
        const usuario = result[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) {
          const token = jwt.sign({ id: usuario.id }, "segredo", {
            expiresIn: "1h",
          });
          return res.status(200).json({ token, userId: usuario.id });
        } else {
          return res.status(401).send("Senha incorreta");
        }
      } else {
        return res.status(404).send("Usuário não encontrado");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao realizar login");
  }
});

// Rota de perfil
app.get("/perfil", verificarToken, (req, res) => {
  const userId = req.userId;
  console.log(`Fetching profile for user ID: ${userId}`);

  const sql = "SELECT * FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Erro ao obter perfil do usuário");
    }
    if (result.length === 0) {
      console.error("User not found with ID:", userId);
      return res.status(404).send("Usuário não encontrado");
    }
    const usuario = result[0];
    res.status(200).json(usuario);
  });
});

app.put("/perfil", verificarToken, async (req, res) => {
  const { telefone, senha, descricao, disponivel } = req.body;
  const userId = req.userId;

  try {
    let sql = "UPDATE usuarios SET ";
    const params = [];
    if (telefone) {
      sql += "telefone = ?, ";
      params.push(telefone);
    }
    if (senha) {
      const hashedSenha = await bcrypt.hash(senha, 10);
      sql += "senha = ?, ";
      params.push(hashedSenha);
    }
    if (descricao) {
      sql += "descricao = ?, ";
      params.push(descricao);
    }
    sql += "disponivel = ? WHERE id = ?";
    params.push(disponivel, userId);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao atualizar perfil do usuário");
      }
      res.status(200).send("Perfil do usuário atualizado com sucesso");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao atualizar perfil do usuário");
  }
});

// Rota para listar trabalhadores (Pessoa Física)
app.get("/trabalhadores", (req, res) => {
  const sql = `SELECT nome, idade, telefone, categoria FROM usuarios WHERE tipo = 'PF'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao obter a lista de trabalhadores");
    }
    res.status(200).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
