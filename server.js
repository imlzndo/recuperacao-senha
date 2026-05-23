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

async function initDB() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id        INT AUTO_INCREMENT PRIMARY KEY,
      email     VARCHAR(255) DEFAULT NULL,
      senha     VARCHAR(255) DEFAULT NULL,
      codigo    VARCHAR(10)  DEFAULT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Banco pronto.');
}
initDB();

app.post('/salvar-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).j
