const mysql = require("mysql2");
require("dotenv").config();

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: "chiara.db",
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
