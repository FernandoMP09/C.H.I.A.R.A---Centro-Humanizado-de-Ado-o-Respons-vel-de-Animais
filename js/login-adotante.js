console.log("JavaScript do login C.H.I.A.R.A conectado!");
const formulario = document.getElementById("form-login");
formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const dadosLogin = {
    email: email,
    senha: senha,
  };
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosLogin),
  })
    .then((resposta) => {
      return resposta.json();
    })
    .then((dados) => {
      console.log("Dados recebidos no login:", dados);
      alert(dados.mensagem);

      if (dados.mensagem === "Login realizado com sucesso!") {
        sessionStorage.setItem("nomeAdotante", dados.nome);
        sessionStorage.setItem("idAdotante", dados.id);

        window.location.href = "adotantes/inicio-adotante.html";
      }
    });
});
// Verifica se o usuário acabou de realizar um cadastro
const cadastroConcluido = sessionStorage.getItem("cadastroConcluido");

if (cadastroConcluido === "true") {
  const popup = document.getElementById("popup-sucesso");

  popup.hidden = false;

  // Remove a informação para não mostrar novamente
  sessionStorage.removeItem("cadastroConcluido");
}

// Fecha o pop-up ao clicar no botão
const botaoFechar = document.getElementById("fechar-popup");
const popup = document.getElementById("popup-sucesso");

botaoFechar.addEventListener("click", function () {
  popup.style.display = "none";
});
