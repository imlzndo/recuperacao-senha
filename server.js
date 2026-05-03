const db = mysql.createPool({
  host:     process.env.MYSQLHOST,
  port:     process.env.MYSQLPORT,
  user:     'root',
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});