
console.log("JavaScript do cadastro C.HI.A.R.A conectado!");

// Endereço do backend publicado no Render
const API_URL = "https://chiara-backend-3ywl.onrender.com";

const formulario = document.getElementById("form-cadastro");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("CPF").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const idade = document.getElementById("idade").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const moradia = document.getElementById("moradia").value;
  const espacoDisponivel = document.getElementById("espaco-disponivel").value;

  const historico = document.getElementById("historico").value;
  const experiencia = document.getElementById("experiencia").value;

  const animaisInteresse = document.getElementById("animais-interesse").value;
  const portePreferido = document.getElementById("porte-preferido").value;

  const outrasInformacoes = document.getElementById("outras-informacoes").value;

  // Verificação das senhas
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  // Organização dos dados do adotante
  const dadosAdotante = {
    nome: nome,
    idade: Number(idade),
    cpf: cpf,
    email: email,
    senha: senha,
    telefone: telefone,
    endereco: endereco,
    moradia: moradia,
    espaco_disponivel: espacoDisponivel,
    historico_animal: historico,
    experiencia_anterior: experiencia,
    interesses: animaisInteresse,
    porte_preferido: portePreferido,
    outras_informacoes: outrasInformacoes,
  };

  // Envio dos dados para o servidor
  fetch(`${API_URL}/adotantes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosAdotante),
  })
    .then((resposta) => {
      console.log("Resposta recebida do servidor:", resposta.status);

      return resposta.json().then((dados) => {
        console.log("Dados recebidos:", dados);

        if (resposta.ok) {
          sessionStorage.setItem("cadastroConcluido", "true");

          window.location.href = "loginadotante.html";
        } else {
          alert(dados.mensagem);
        }
      });
    })
    .catch((erro) => {
      console.error("Erro ao conectar ao servidor:", erro);

      alert(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
    });
});
