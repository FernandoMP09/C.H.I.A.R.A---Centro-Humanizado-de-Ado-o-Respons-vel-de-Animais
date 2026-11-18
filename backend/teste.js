const http = require("http");

const dados = {
    nome: "Joao da Silva",
    idade: 25,
    cpf: "175-241-927-89",
    email: "joao.novo2026@gmail.com",
    senha: "MinhaSenha123",
    telefone: "24999999999",
    endereco: "Rua das Flores, 100",
    moradia: "Casa",
    espaco_disponivel: "Sim",
    historico_animal: "Já tive um cachorro",
    experiencia_anterior: "Sim",
    interesses: "Cachorros",
    porte_preferido: "Médio",
    outras_informacoes: "Tenho disponibilidade para cuidar do animal"
};

const dadosJSON = JSON.stringify(dados);

const opcoes = {
    hostname: "localhost",
    port: 3000,
    path: "/adotantes",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

const requisicao = http.request(opcoes, (res) => {
    res.on("data", (resposta) => {
        console.log("Resposta do servidor:", resposta.toString());
    });
});

requisicao.write(dadosJSON);
requisicao.end();