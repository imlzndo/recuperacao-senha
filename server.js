async function initDB() {
  await db.query('DROP TABLE IF EXISTS usuarios');
  await db.query(`
    CREATE TABLE usuarios (
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
