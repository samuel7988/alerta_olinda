const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'coleta_lixo'
});

// Teste de conexão
db.getConnection((err, conn) => {
  if (err) {
    console.log('Erro na conexão com MySQL');
  } else {
    console.log('Conectado ao MySQL');
    conn.release();
  }
});

// Cadastrar denúncia
app.post('/api/denuncias', (req, res) => {
  const { latitude, longitude, descricao } = req.body;

  const sql = 'INSERT INTO denuncias (latitude, longitude, descricao) VALUES (?, ?, ?)';
  db.query(sql, [latitude, longitude, descricao], (err, result) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao salvar' });
    } else {
      res.json({ mensagem: 'Denúncia salva com sucesso' });
    }
  });
});

// Listar denúncias
app.get('/api/denuncias', (req, res) => {
  const sql = 'SELECT * FROM denuncias';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao buscar' });
    } else {
      res.json(results);
    }
  });
});

// Listar horários de coleta
app.get('/api/horarios-coleta', (req, res) => {
  const sql = 'SELECT * FROM horarios_coleta';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao buscar' });
    } else {
      res.json(results);
    }
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
