
const mysql = require("mysql2");
require("dotenv").config();

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2"
  },
  connectTimeout: 30000,
  waitForConnections: true,
  connectionLimit: 10
});

conexao.getConnection((erro, conexaoTeste) => {
  if (erro) {
    console.error("Erro ao conectar o MySQL:", erro);
    return;
  }

  console.log("Conectado ao banco de dados C.HI.A.R.A!");

  conexaoTeste.release();
});

module.exports = conexao;
