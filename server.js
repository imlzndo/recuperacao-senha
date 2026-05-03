const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host:     process.env.MYSQLHOST     || 'localhost',
  port:     process.env.MYSQLPORT     || 3306,
  user:     process.env.MYSQLUSER     || 'root',
  password: process.env.MYSQLPASSWORD || 'ybbobarapSeo!00',
  database: process.env.MYSQLDATABASE || 'cadastro_db'
});

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
    return res.json({ mensagem: 'Salvo com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
