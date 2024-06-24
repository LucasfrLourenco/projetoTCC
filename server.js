const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos do diretório 'imagens'
app.use("/imagens", express.static(path.join(__dirname, "imagens")));

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
    next();
  });
}

// Configuração do multer para armazenar imagens no diretório 'imagens'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imagens/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro para aceitar apenas arquivos de imagem
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Erro: Apenas arquivos de imagem são permitidos!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
});

// Rota de cadastro com validação de usuário existente
app.post("/cadastro", async (req, res) => {
  const { nome, cpfCnpj, telefone, email, senha, tipo, idade, categoria } =
    req.body;

  try {
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
          return res
            .status(200)
            .json({ token, tipo: usuario.tipo, userId: usuario.id });
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
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Erro ao obter perfil do usuário");
    }
    if (result.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }
    const usuario = result[0];
    res.status(200).json(usuario);
  });
});

app.put(
  "/perfil",
  verificarToken,
  upload.single("imagem"),
  async (req, res) => {
    const { telefone, senha, descricao, disponivel, categoria, nome, idade } =
      req.body;
    const userId = req.userId;
    const imagem = req.file ? req.file.filename : null;

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
      if (disponivel !== undefined) {
        sql += "disponivel = ?, ";
        params.push(disponivel);
      }
      if (categoria) {
        sql += "categoria = ?, ";
        params.push(categoria);
      }
      if (nome) {
        sql += "nome = ?, ";
        params.push(nome);
      }
      if (idade) {
        sql += "idade = ?, ";
        params.push(idade);
      }
      if (imagem) {
        sql += "imagem = ?, ";
        params.push(imagem);
      }

      // Remove a última vírgula e espaço do SQL
      sql = sql.slice(0, -2);

      sql += " WHERE id = ?";
      params.push(userId);

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
  }
);

// Rota para obter lista de trabalhadores
app.get("/trabalhadores", (req, res) => {
  const sql =
    "SELECT id, nome, idade, telefone, categoria, descricao, imagem FROM usuarios WHERE tipo = 'PF' AND disponivel = 1";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao obter a lista de trabalhadores:", err);
      return res.status(500).send("Erro ao obter a lista de trabalhadores");
    }
    res.status(200).json(result);
  });
});

// Rota para obter detalhes de um trabalhador
app.get("/trabalhador/:id", (req, res) => {
  const userId = req.params.id;
  const sql =
    "SELECT id, nome, email, cpfCnpj, idade, telefone, categoria, descricao, disponivel, imagem FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erro ao obter detalhes do trabalhador:", err);
      return res.status(500).send("Erro ao obter detalhes do trabalhador");
    }
    if (result.length === 0) {
      return res.status(404).send("Trabalhador não encontrado");
    }
    res.status(200).json(result[0]);
  });
});

// Rota para adicionar avaliação
app.post("/avaliacao", verificarToken, (req, res) => {
  const { trabalhador_id, nota, comentario } = req.body;
  const usuario_id = req.userId;

  const sqlCheck = `SELECT tipo FROM usuarios WHERE id = ?`;
  db.query(sqlCheck, [usuario_id], (err, result) => {
    if (err) {
      return res.status(500).send("Erro ao verificar usuário");
    }
    if (result.length === 0 || result[0].tipo !== "PJ") {
      return res.status(403).send("Apenas usuários PJ podem avaliar");
    }

    const sqlInsert = `INSERT INTO avaliacoes (trabalhador_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?)`;
    db.query(
      sqlInsert,
      [trabalhador_id, usuario_id, nota, comentario],
      (err, result) => {
        if (err) {
          return res.status(500).send("Erro ao adicionar avaliação");
        }
        res.status(200).send("Avaliação adicionada com sucesso");
      }
    );
  });
});

// Rota para obter avaliações de um trabalhador
app.get("/avaliacoes/:trabalhador_id", (req, res) => {
  const { trabalhador_id } = req.params;
  const sql = `SELECT a.nota, a.comentario, u.nome AS avaliador FROM avaliacoes a JOIN usuarios u ON a.usuario_id = u.id WHERE trabalhador_id = ?`;
  db.query(sql, [trabalhador_id], (err, result) => {
    if (err) {
      return res.status(500).send("Erro ao obter avaliações");
    }
    res.status(200).json(result);
  });
});

// Rota para obter a média das avaliações de um trabalhador
// Endpoint para obter a média das avaliações de um trabalhador
app.get("/avaliacoes/media/:trabalhador_id", (req, res) => {
  const { trabalhador_id } = req.params;
  const sql = `SELECT AVG(nota) as media FROM avaliacoes WHERE trabalhador_id = ?`;
  db.query(sql, [trabalhador_id], (err, result) => {
    if (err) {
      return res.status(500).send("Erro ao calcular média das avaliações");
    }
    res.status(200).json(result[0].media || 0); // Retornar 0 se não houver avaliações
  });
});

app.get("/me", verificarToken, (req, res) => {
  const userId = req.userId;
  const sql = "SELECT tipo FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erro ao obter informações do usuário", err);
      return res.status(500).send("Erro ao obter informações do usuário");
    }
    if (result.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }
    res.status(200).json({ tipo: result[0].tipo });
  });
});

// Rota para criar uma nova vaga
app.post("/vagas", verificarToken, (req, res) => {
  const { funcao, descricao, data_inicial, data_final } = req.body;
  const empresa_id = req.userId;

  const today = new Date().toISOString().split("T")[0];

  if (data_inicial < today || data_final < today) {
    return res.status(400).send("As datas devem ser de hoje em diante");
  }

  if (data_inicial > data_final) {
    return res
      .status(400)
      .send("A data inicial não pode ser maior que a data final");
  }

  const sql =
    "INSERT INTO vagas (empresa_id, funcao, descricao, data_inicial, data_final) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [empresa_id, funcao, descricao, data_inicial, data_final],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar vaga:", err);
        return res.status(500).send("Erro ao criar vaga");
      }
      res.status(201).send("Vaga criada com sucesso");
    }
  );
});

app.get("/vagas", (req, res) => {
  const sql = `
    SELECT v.*, u.nome AS empresa_nome, u.telefone AS empresa_telefone 
    FROM vagas v 
    JOIN usuarios u ON v.empresa_id = u.id
    WHERE v.data_inicial IS NOT NULL AND v.data_final IS NOT NULL;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao obter vagas:", err);
      return res.status(500).send("Erro ao obter vagas");
    }
    res.status(200).json(result);
  });
});

// Rota para obter os anúncios do usuário logado
// Dentro da rota para obter os anúncios do usuário logado
app.get("/vagas/meu-anuncio/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT * 
    FROM vagas 
    WHERE empresa_id = ? 
      AND data_inicial IS NOT NULL 
      AND data_final IS NOT NULL;
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar vagas do usuário:", err);
      return res.status(500).send("Erro ao buscar vagas do usuário");
    }
    res.status(200).json(result);
  });
});

// Rota para deletar uma vaga
app.delete("/vagas/:id", verificarToken, (req, res) => {
  const vagaId = req.params.id;
  const sql = "DELETE FROM vagas WHERE id = ? AND empresa_id = ?";

  db.query(sql, [vagaId, req.userId], (err, result) => {
    if (err) {
      console.error("Erro ao deletar vaga:", err);
      return res.status(500).send("Erro ao deletar vaga");
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send(
          "Vaga não encontrada ou você não tem permissão para deletar essa vaga"
        );
    }

    res.status(200).send("Vaga deletada com sucesso");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
