const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'ybbobarapSeo!00',       // ← coloque sua senha do MySQL aqui
  database: 'cadastro_db'
});

// Salva e-mail e senha como novo registro
app.post('/cadastrar', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  try {
    await db.query(
      'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
      [email, senha]
    );
    return res.json({ mensagem: 'Cadastrado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:' + PORT);
});
