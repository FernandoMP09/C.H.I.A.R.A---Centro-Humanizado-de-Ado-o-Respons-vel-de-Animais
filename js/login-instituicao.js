console.log("JavaScript do login institucional conectado!");
const form = document.getElementById("form-login-instituicao");

console.log(form);

const formulario = document.getElementById("form-login-instituicao");

formulario.addEventListener("submit", function (event) {
    console.log("Botão de entrar acionado!");
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const dadosLogin = { email, senha };

    fetch("http://localhost:3000/login-instituicao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosLogin)
    })
        .then((resposta) => resposta.json())
        .then((dados) => {
            console.log("Resposta do servidor:", dados);
            alert(dados.mensagem);

            if (dados.mensagem === "Login institucional realizado com sucesso!") {
                sessionStorage.setItem("nomeInstituicao", dados.nome);
                sessionStorage.setItem("idInstituicao", dados.id);

                window.location.href = "instituicao/dashbord-instituicao.html";
            }
        })
        .catch((erro) => {
            console.error("Erro ao conectar ao servidor:", erro);
            alert("Não foi possível conectar ao servidor. Tente novamente.");
        });
});