const http = require("http");

const servidor = http.createServer((req, res) => {

    if (req.url === "/") {
        res.end("Bem-vindo ao C.HI.A.R.A!");
    }

    else if (req.url === "/animais") {
        res.end("Lista de animais disponiveis");
    }

    else if (req.url === "/instituicoes") {
        res.end("Lista de instituicoes cadastradas");
    }

    else {
        res.statusCode = 404;
        res.end("Pagina nao encontrada");
    }

});

servidor.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!");
});