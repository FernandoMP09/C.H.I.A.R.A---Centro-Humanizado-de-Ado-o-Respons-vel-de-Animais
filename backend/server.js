const http = require("http");
const conexao = require("./db");
const bcrypt = require("bcryptjs");

// ==========================================
// CONFIGURAÇÕES
// ==========================================

const origemPermitida = "http://127.0.0.1:5500";

function responderJSON(res, statusCode, dados) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(dados));
}

// ==========================================
// VALIDAÇÃO DE CPF
// ==========================================

function validarCPF(cpf) {
  if (typeof cpf !== "string") {
    return false;
  }

  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = soma % 11;
  let primeiroDigito = resto < 2 ? 0 : 11 - resto;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = soma % 11;
  let segundoDigito = resto < 2 ? 0 : 11 - resto;

  return primeiroDigito === Number(cpf[9]) && segundoDigito === Number(cpf[10]);
}

// ==========================================
// CRIAÇÃO DO SERVIDOR
// ==========================================

const servidor = http.createServer((req, res) => {
  console.log(req.method, req.url);

  // Configuração CORS
  res.setHeader("Access-Control-Allow-Origin", origemPermitida);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Tratamento de requisições OPTIONS
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // ==========================================
  // ROTA: CADASTRO DE ADOTANTES
  // ==========================================

  if (req.method === "POST" && req.url === "/adotantes") {
    let corpo = "";

    req.on("data", (pedaco) => {
      corpo += pedaco;
    });

    req.on("end", () => {
      try {
        const dados = JSON.parse(corpo);

        // Verificação dos campos obrigatórios
        if (
          !dados.nome ||
          dados.idade === undefined ||
          dados.idade === null ||
          dados.idade === "" ||
          !dados.cpf ||
          !dados.email ||
          !dados.senha
        ) {
          responderJSON(res, 400, {
            mensagem: "Preencha todos os campos obrigatórios!",
          });
          return;
        }

        // Validação da idade
        if (
          !Number.isInteger(Number(dados.idade)) ||
          Number(dados.idade) <= 0
        ) {
          responderJSON(res, 400, {
            mensagem: "Informe uma idade válida!",
          });
          return;
        }

        // Validação do CPF
        if (!validarCPF(dados.cpf)) {
          responderJSON(res, 400, {
            mensagem: "Informe um CPF válido!",
          });
          return;
        }

        // Validação do tipo de e-mail
        if (typeof dados.email !== "string") {
          responderJSON(res, 400, {
            mensagem: "Informe um e-mail válido!",
          });
          return;
        }

        const email = dados.email.trim();
        const emailNormalizado = email.toLowerCase();

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {
          responderJSON(res, 400, {
            mensagem: "Informe um e-mail válido!",
          });
          return;
        }

        // Proteção da senha
        bcrypt.hash(dados.senha, 10, (erro, hash) => {
          if (erro) {
            console.error("Erro ao proteger a senha:", erro);

            responderJSON(res, 500, {
              mensagem: "Erro ao realizar o cadastro!",
            });
            return;
          }

          console.log("Hash gerado com sucesso!");

          const cpfLimpo = dados.cpf.replace(/\D/g, "");

          // Comando SQL
          const sql = `
            INSERT INTO adotantes
            (
              nome,
              idade,
              cpf,
              email,
              senha,
              telefone,
              endereco,
              moradia,
              espaco_disponivel,
              historico_animal,
              experiencia_anterior,
              interesses,
              porte_preferido,
              outras_informacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const valores = [
            dados.nome,
            Number(dados.idade),
            cpfLimpo,
            emailNormalizado,
            hash,
            dados.telefone || null,
            dados.endereco,
            dados.moradia,
            dados.espaco_disponivel,
            dados.historico_animal || null,
            dados.experiencia_anterior || null,
            dados.interesses || null,
            dados.porte_preferido,
            dados.outras_informacoes || null,
          ];

          // Inserção no banco de dados
          conexao.query(sql, valores, (erro, resultado) => {
            if (erro) {
              console.error("Erro ao cadastrar adotante:", erro);

              if (erro.code === "ER_DUP_ENTRY") {
                responderJSON(res, 409, {
                  mensagem: "CPF ou e-mail já cadastrado!",
                });
                return;
              }

              responderJSON(res, 500, {
                mensagem: "Erro ao realizar o cadastro!",
              });
              return;
            }

            responderJSON(res, 201, {
              mensagem: "Adotante cadastrado com sucesso!",
            });
          });
        });
      } catch (erro) {
        console.error("Erro ao interpretar o JSON:", erro);

        responderJSON(res, 400, {
          mensagem: "Os dados enviados são inválidos!",
        });
      }
    });

    return;
  }

  // ==========================================
  // ROTA: LOGIN DE ADOTANTES
  // ==========================================
  else if (req.method === "POST" && req.url === "/login") {
    let corpo = "";

    req.on("data", (pedaco) => {
      corpo += pedaco;
    });

    req.on("end", () => {
      try {
        const dados = JSON.parse(corpo);

        // Verificação dos campos
        if (
          typeof dados.email !== "string" ||
          typeof dados.senha !== "string" ||
          !dados.email.trim() ||
          !dados.senha
        ) {
          responderJSON(res, 400, {
            mensagem: "Informe o e-mail e a senha!",
          });
          return;
        }

        const email = dados.email.trim().toLowerCase();

        // Consulta ao banco de dados
        const sql = "SELECT * FROM adotantes WHERE email = ?";

        conexao.query(sql, [email], (erro, resultados) => {
          if (erro) {
            console.error("Erro ao consultar adotante:", erro);

            responderJSON(res, 500, {
              mensagem: "Erro interno ao realizar login!",
            });
            return;
          }

          // Verifica se o e-mail foi encontrado
          if (resultados.length === 0) {
            responderJSON(res, 401, {
              mensagem: "E-mail ou senha incorretos!",
            });
            return;
          }

          const adotante = resultados[0];

          // Compara a senha digitada com o hash armazenado
          bcrypt.compare(dados.senha, adotante.senha, (erro, senhaCorreta) => {
            if (erro) {
              console.error("Erro ao verificar senha:", erro);

              responderJSON(res, 500, {
                mensagem: "Erro ao verificar a senha!",
              });
              return;
            }

            // Senha incorreta
            if (!senhaCorreta) {
              responderJSON(res, 401, {
                mensagem: "E-mail ou senha incorretos!",
              });
              return;
            }

            // Login realizado
            responderJSON(res, 200, {
              mensagem: "Login realizado com sucesso!",
              id: adotante.id,
              nome: adotante.nome,
            });
          });
        });
      } catch (erro) {
        console.error("Erro ao interpretar JSON do login:", erro);

        responderJSON(res, 400, {
          mensagem: "Os dados enviados são inválidos!",
        });
      }
    });

    return;
  }
  // ==========================================
  // ROTA: LOGIN DAS INSTITUIÇÕES
  // ==========================================
  else if (req.method === "POST" && req.url === "/login-instituicao") {
    let corpo = "";

    req.on("data", (pedaco) => {
      corpo += pedaco;
    });

    req.on("end", () => {
      try {
        const dados = JSON.parse(corpo);

        if (
          typeof dados.email !== "string" ||
          typeof dados.senha !== "string" ||
          !dados.email.trim() ||
          !dados.senha
        ) {
          responderJSON(res, 400, {
            mensagem: "Informe o e-mail e a senha!",
          });
          return;
        }

        const email = dados.email.trim().toLowerCase();

        const sql = "SELECT * FROM instituicoes WHERE email = ?";

        conexao.query(sql, [email], (erro, resultados) => {
          if (erro) {
            console.error("Erro ao consultar instituição:", erro);

            responderJSON(res, 500, {
              mensagem: "Erro interno ao realizar login!",
            });
            return;
          }

          if (resultados.length === 0) {
            responderJSON(res, 401, {
              mensagem: "E-mail ou senha incorretos!",
            });
            return;
          }

          const instituicao = resultados[0];

          if (instituicao.status !== "ativo") {
            responderJSON(res, 403, {
              mensagem: "Esta instituição não está ativa!",
            });
            return;
          }

          bcrypt.compare(
            dados.senha,
            instituicao.senha,
            (erro, senhaCorreta) => {
              if (erro) {
                console.error("Erro ao verificar senha:", erro);

                responderJSON(res, 500, {
                  mensagem: "Erro ao verificar a senha!",
                });
                return;
              }

              if (!senhaCorreta) {
                responderJSON(res, 401, {
                  mensagem: "E-mail ou senha incorretos!",
                });
                return;
              }

              responderJSON(res, 200, {
                mensagem: "Login institucional realizado com sucesso!",
                id: instituicao.id,
                nome: instituicao.nome,
              });
            },
          );
        });
      } catch (erro) {
        console.error("Erro ao interpretar JSON:", erro);

        responderJSON(res, 400, {
          mensagem: "Os dados enviados são inválidos!",
        });
      }
    });

    return;
  }
  // ==========================================
  // ROTA: CONSULTAR ANIMAIS DISPONÍVEIS
  // ==========================================
  else if (req.method === "GET" && req.url === "/animais") {
    conexao.query(
      "SELECT * FROM animais WHERE status = ?",
      ["disponivel"],
      (erro, resultados) => {
        if (erro) {
          console.error("Erro na consulta:", erro);

          responderJSON(res, 500, {
            mensagem: "Erro ao buscar animais!",
          });
          return;
        }

        responderJSON(res, 200, resultados);
      },
    );

    return;
  }

  // ==========================================
  // ROTA: INSTITUIÇÕES
  // ==========================================
  else if (req.method === "GET" && req.url === "/instituicoes") {
    responderJSON(res, 200, {
      mensagem: "Lista de instituições cadastradas",
    });

    return;
  }

  // ==========================================
  // ROTA INICIAL
  // ==========================================
  else if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end("Bem-vindo ao C.HI.A.R.A!");
    return;
  }

  // ==========================================
  // ROTA NÃO ENCONTRADA
  // ==========================================
  else {
    responderJSON(res, 404, {
      mensagem: "Página não encontrada!",
    });
    return;
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

servidor.listen(3000, () => {
  console.log("Servidor rodando na porta 3000!");
});
